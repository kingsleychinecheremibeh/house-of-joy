"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────
interface MediaItem {
  id?: number;
  url: string;
  publicId: string;
  type: "image" | "video";
  createdAt?: string;
}

interface AdminMediaItem {
  id: number;
  url: string;
  public_id: string;
  type: "image" | "video";
  sort_order: number;
  color_tag?: string | null;
}

interface Fabric {
  id: number;
  name: string;
  category: string;
  description: string;
  price?: string | null;
  in_stock: boolean;
  media: AdminMediaItem[];
}

const CATEGORIES = ["Lace", "Sequins", "Stones", "Aso Ebi"];

// ── Helpers ───────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Media Picker Modal ────────────────────────────────────────────────────
function MediaPickerModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
}) {
  const [tab, setTab] = useState<"upload" | "gallery">("upload");
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previews, setPreviews] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = useCallback(async () => {
    if (gallery.length > 0) return;
    setGalleryLoading(true);
    const res = await fetch("/api/media");
    if (res.ok) {
      const data = await res.json();
      setGallery(data);
    }
    setGalleryLoading(false);
  }, [gallery.length]);

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setUploadError("");

    const results: MediaItem[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setUploadError("Only images and videos are allowed.");
        continue;
      }

      try {
        const base64Data = await fileToBase64(file);
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data, mimeType: file.type }),
        });

        if (res.ok) {
          const data = await res.json();
          results.push(data);
        } else {
          const err = await res.json();
          setUploadError(err.error || "Upload failed");
        }
      } catch {
        setUploadError("Upload failed. Please try again.");
      }
    }

    setPreviews((prev) => [...prev, ...results]);
    setUploading(false);
  }

  function toggleGallerySelect(item: MediaItem) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.publicId)) {
        next.delete(item.publicId);
      } else {
        next.add(item.publicId);
      }
      return next;
    });
  }

  function handleConfirm() {
    if (tab === "upload") {
      onSelect(previews);
    } else {
      const selectedItems = gallery.filter((g) => selected.has(g.publicId));
      onSelect(selectedItems);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full md:max-w-3xl md:rounded-none max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100">
          <h3 className="font-serif text-xl">Add Photos & Videos</h3>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === "upload"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/40"
            }`}
          >
            Upload New
          </button>
          <button
            onClick={() => {
              setTab("gallery");
              loadGallery();
            }}
            className={`flex-1 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === "gallery"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/40"
            }`}
          >
            My Gallery
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "upload" ? (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-neutral-200 p-10 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-4xl mb-2">📷</p>
                <p className="font-sans text-sm text-foreground/60">
                  Click to select photos or videos
                </p>
                <p className="font-sans text-xs text-foreground/30 mt-1">
                  JPG, PNG, MP4, MOV · Max 50MB per file · Multiple allowed
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />

              {uploading && (
                <p className="text-center font-sans text-sm text-foreground/50">
                  Uploading... please wait
                </p>
              )}

              {uploadError && (
                <p className="text-red-500 font-sans text-sm">{uploadError}</p>
              )}

              {/* Previews of uploaded files */}
              {previews.length > 0 && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3">
                    Uploaded ({previews.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {previews.map((item, i) => (
                      <div key={i} className="relative aspect-square bg-neutral-100">
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        )}
                        <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 uppercase">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Gallery */
            <div>
              {galleryLoading ? (
                <p className="text-center py-10 font-sans text-sm text-foreground/40">
                  Loading your gallery...
                </p>
              ) : gallery.length === 0 ? (
                <p className="text-center py-10 font-sans text-sm text-foreground/40">
                  Your gallery is empty. Upload some files first.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {gallery.map((item) => {
                    const isSelected = selected.has(item.publicId);
                    return (
                      <div
                        key={item.publicId}
                        onClick={() => toggleGallerySelect(item)}
                        className={`relative aspect-square cursor-pointer border-2 transition-all ${
                          isSelected
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <span className="bg-primary text-white text-xs w-6 h-6 flex items-center justify-center font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                        <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 uppercase">
                          {item.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex justify-between items-center">
          <p className="font-sans text-xs text-foreground/40">
            {tab === "gallery" && selected.size > 0
              ? `${selected.size} item${selected.size > 1 ? "s" : ""} selected`
              : tab === "upload" && previews.length > 0
              ? `${previews.length} file${previews.length > 1 ? "s" : ""} ready`
              : ""}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-200 font-sans text-xs uppercase tracking-[0.2em] hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                tab === "upload" ? previews.length === 0 : selected.size === 0
              }
              className="px-5 py-2.5 bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-primary-light disabled:opacity-40 transition-colors"
            >
              Attach to Fabric
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loadingFabrics, setLoadingFabrics] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [newFabricMedia, setNewFabricMedia] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [duplicatingId, setDuplicatingId] = useState<number | null>(null);

  // Drag and drop state
  const [draggedMediaId, setDraggedMediaId] = useState<number | null>(null);
  const [dragOverMediaId, setDragOverMediaId] = useState<number | null>(null);

  // Media picker
  const [pickerFabricId, setPickerFabricId] = useState<number | "new" | null>(null);
  const [attachingMedia, setAttachingMedia] = useState(false);

  // Custom confirm modal (replaces browser confirm())
  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onOk: () => void;
  } | null>(null);

  function showConfirm(message: string, onOk: () => void) {
    setConfirmModal({ message, onOk });
  }

  // ── Load fabrics ──────────────────────────────────────────────────────
  async function loadFabrics() {
    setLoadingFabrics(true);
    const res = await fetch("/api/fabrics");
    const data = await res.json();
    setFabrics(Array.isArray(data) ? data : []);
    setLoadingFabrics(false);
  }

  // ── Login ─────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
      loadFabrics();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Wrong password. Please try again.");
    }
    setLoginLoading(false);
  }

  // ── Logout ────────────────────────────────────────────────────────────
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setFabrics([]);
  }

  // ── Create fabric ─────────────────────────────────────────────────────
  async function handleCreateFabric(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const res = await fetch("/api/fabrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, description }),
    });
    if (res.ok) {
      const newFabric = await res.json();
      
      // If media was added during creation, link it now
      if (newFabricMedia.length > 0) {
        for (let i = 0; i < newFabricMedia.length; i++) {
          const item = newFabricMedia[i];
          await fetch(`/api/fabrics/${newFabric.id}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: item.url,
              publicId: item.publicId,
              type: item.type,
              sortOrder: i,
            }),
          });
        }
      }

      setSuccessMsg("Fabric created with photos successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setName("");
      setCategory(CATEGORIES[0]);
      setDescription("");
      setNewFabricMedia([]);
      setShowAddForm(false);
      await loadFabrics();
    } else {
      const err = await res.json();
      setSaveError(err.error || "Failed to create. Try again.");
    }
    setSaving(false);
  }

  // ── Attach media to fabric ─────────────────────────────────────────────
  async function handleMediaSelected(fabricId: number | "new", items: MediaItem[]) {
    if (fabricId === "new") {
      setNewFabricMedia(prev => [...prev, ...items]);
      return;
    }

    setAttachingMedia(true);
    const existing = fabrics.find((f) => f.id === fabricId)?.media || [];

    for (const item of items) {
      await fetch(`/api/fabrics/${fabricId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: item.url,
          publicId: item.publicId,
          type: item.type,
          sortOrder: existing.length,
        }),
      });
    }

    await loadFabrics();
    setAttachingMedia(false);
    setSuccessMsg("Media added! It is now live on the website.");
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  // ── Delete media item ─────────────────────────────────────────────────
  async function handleDeleteMedia(
    fabricId: number,
    mediaId: number,
    type: string
  ) {
    showConfirm("Remove this photo/video?", async () => {
      await fetch(
        `/api/fabrics/${fabricId}/media?mediaId=${mediaId}&type=${type}`,
        { method: "DELETE" }
      );
      loadFabrics();
    });
  }

  // ── Delete fabric ─────────────────────────────────────────────────────
  async function handleDeleteFabric(id: number) {
    showConfirm("Delete this fabric and all its photos/videos? This cannot be undone.", async () => {
      await fetch(`/api/fabrics/${id}`, { method: "DELETE" });
      loadFabrics();
    });
  }

  // ── Save edit ─────────────────────────────────────────────────────────
  async function handleSaveEdit(id: number) {
    await fetch(`/api/fabrics/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        category: editCategory,
        description: editDescription,
      }),
    });
    setEditingId(null);
    loadFabrics();
  }

  async function handleDuplicateFabric(id: number) {
    showConfirm("Duplicate this fabric? A copy will be added to the top of your list.", async () => {
      setDuplicatingId(id);
      const res = await fetch(`/api/admin/fabrics/${id}/duplicate`, {
        method: "POST"
      });
      setDuplicatingId(null);
      if (res.ok) {
        loadFabrics();
        setSuccessMsg("Fabric duplicated!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    });
  }
  // ─────────────────────────────────────────────────────────────────────
  // DRAG AND DROP HANDLERS
  // ─────────────────────────────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggedMediaId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    if (draggedMediaId === id) return;
    setDragOverMediaId(id);
  }

  async function handleDrop(e: React.DragEvent, targetId: number, fabricId: number) {
    e.preventDefault();
    setDragOverMediaId(null);
    if (!draggedMediaId || draggedMediaId === targetId) return;

    const fabric = fabrics.find((f) => f.id === fabricId);
    if (!fabric) return;

    const newMediaList = [...fabric.media];
    const draggedIndex = newMediaList.findIndex((m) => m.id === draggedMediaId);
    const targetIndex = newMediaList.findIndex((m) => m.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Move item
    const [draggedItem] = newMediaList.splice(draggedIndex, 1);
    newMediaList.splice(targetIndex, 0, draggedItem);
    
    // Update sort_order locally
    newMediaList.forEach((m, i) => m.sort_order = i);

    setFabrics(fabrics.map((f) => 
      f.id === fabricId ? { ...f, media: newMediaList } : f
    ));

    const updates = newMediaList.map(m => ({ id: m.id, sortOrder: m.sort_order }));
    setDraggedMediaId(null);

    await fetch(`/api/admin/fabrics/${fabricId}/media/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-white tracking-widest">
              HOUSE OF <span className="text-accent">JOY</span>
            </h1>
            <p className="text-white/40 font-sans text-sm mt-2 uppercase tracking-[0.2em]">
              Admin Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-4 font-sans text-sm focus:outline-none focus:border-accent transition-colors"
              required
            />
            {loginError && (
              <p className="text-red-400 font-sans text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-accent text-charcoal py-4 font-sans text-xs uppercase tracking-[0.3em] font-bold hover:bg-accent-light transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Media Picker Modal */}
      {pickerFabricId !== null && (
        <MediaPickerModal
          onClose={() => setPickerFabricId(null)}
          onSelect={(items) => handleMediaSelected(pickerFabricId, items)}
        />
      )}

      {/* Custom Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-charcoal text-white w-full max-w-sm p-8 shadow-2xl flex flex-col gap-6">
            <p className="font-sans text-sm leading-relaxed text-white/80">
              {confirmModal.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2.5 border border-white/20 text-white/60 hover:text-white font-sans text-xs uppercase tracking-[0.2em] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onOk();
                  setConfirmModal(null);
                }}
                className="px-5 py-2.5 bg-accent text-charcoal font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent-light transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


      <header className="bg-charcoal px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="font-serif text-lg sm:text-xl text-white tracking-widest flex items-center gap-x-2 sm:gap-x-3 shrink-0">
          <span>HOUSE OF <span className="text-accent">JOY</span></span>
          <span className="hidden sm:inline text-white/40 font-sans text-xs uppercase tracking-[0.2em]">
            Dashboard
          </span>
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href="/"
            className="text-white/50 hover:text-accent font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors"
          >
            <span className="hidden sm:inline">View Site ↗</span>
            <span className="sm:hidden">Site ↗</span>
          </a>
          <button
            onClick={handleLogout}
            className="border border-white/20 text-white/70 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Success toast */}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 font-sans text-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl text-foreground">My Fabrics</h2>
            <p className="text-foreground/50 font-sans text-sm mt-1">
              {fabrics.length} fabric{fabrics.length !== 1 ? "s" : ""} on your website
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-white px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-primary-light transition-colors"
          >
            {showAddForm ? "Cancel" : "+ Add New Fabric"}
          </button>
        </div>

        {/* Add Fabric Form */}
        {showAddForm && (
          <div className="bg-white border border-neutral-200 p-8 mb-10">
            <h3 className="font-serif text-2xl mb-6">New Fabric Details</h3>
            <form onSubmit={handleCreateFabric} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
                    Fabric Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Emerald Sequin Lace"
                    className="w-full border border-neutral-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-neutral-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the fabric..."
                  rows={3}
                  className="w-full border border-neutral-200 px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Pre-upload Media Section */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-foreground/60">
                    Photos & Videos ({newFabricMedia.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickerFabricId("new")}
                    className="text-primary font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:underline"
                  >
                    + Add Media
                  </button>
                </div>

                {newFabricMedia.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
                    {newFabricMedia.map((item, idx) => (
                      <div key={item.publicId} className="relative aspect-square border border-neutral-200">
                        {item.type === "video" ? (
                          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                            <span className="text-xs">▶</span>
                          </div>
                        ) : (
                          <Image src={item.url} alt="" fill className="object-cover" sizes="60px" />
                        )}
                        <button
                          type="button"
                          onClick={() => setNewFabricMedia(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {newFabricMedia.length === 0 && (
                  <p className="font-sans text-xs text-foreground/40 italic">
                    Add photos now, or you can add them later.
                  </p>
                )}
              </div>

              {saveError && (
                <p className="text-red-500 font-sans text-sm">{saveError}</p>
              )}
              
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.3em] font-bold hover:bg-primary-light disabled:opacity-50 mt-2"
              >
                {saving ? "Saving Fabric..." : "Save Fabric"}
              </button>
            </form>
          </div>
        )}

        {/* Fabrics List */}
        {loadingFabrics ? (
          <div className="text-center py-20 text-foreground/40 font-sans text-sm">
            Loading your fabrics...
          </div>
        ) : fabrics.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-100">
            <p className="text-4xl mb-4">🧵</p>
            <p className="font-serif text-2xl text-foreground/50 mb-2">
              No fabrics yet
            </p>
            <p className="font-sans text-sm text-foreground/40">
              Click "Add New Fabric" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {fabrics.map((fabric) => (
              <div
                key={fabric.id}
                className="bg-white border border-neutral-100 overflow-hidden"
              >
                {/* Fabric Header */}
                <div className="px-6 py-5 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  {editingId === fabric.id ? (
                    <div className="flex flex-col md:flex-row gap-3 flex-1">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-neutral-200 px-3 py-2 font-sans text-sm focus:outline-none focus:border-primary flex-1"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="border border-neutral-200 px-3 py-2 font-sans text-sm focus:outline-none focus:border-primary bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={1}
                        className="border border-neutral-200 px-3 py-2 font-sans text-sm focus:outline-none focus:border-primary resize-none flex-1"
                      />
                      <div className="flex flex-wrap gap-2 mt-2 md:mt-0 w-full md:w-auto">
                        <button
                          onClick={() => handleSaveEdit(fabric.id)}
                          className="bg-primary text-white px-4 py-2 font-sans text-xs uppercase tracking-widest hover:bg-primary-light"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="border border-neutral-200 px-4 py-2 font-sans text-xs uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-dark font-semibold">
                          {fabric.category}
                        </span>
                        <h3 className="font-serif text-xl mt-0.5">
                          {fabric.name}
                        </h3>
                        {fabric.description && (
                          <p className="text-foreground/50 font-sans text-sm mt-1">
                            {fabric.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0 mt-3 md:mt-0 w-full md:w-auto">
                        {/* Stock toggle */}
                        <button
                          onClick={async () => {
                            await fetch(`/api/fabrics/${fabric.id}/stock`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ inStock: !fabric.in_stock }),
                            });
                            loadFabrics();
                          }}
                          className={`px-4 py-2 font-sans text-xs uppercase tracking-widest transition-all border ${
                            fabric.in_stock
                              ? "border-green-200 text-green-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                              : "border-neutral-200 text-foreground/40 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                          }`}
                          title={fabric.in_stock ? "Click to mark out of stock" : "Click to mark in stock"}
                        >
                          {fabric.in_stock ? "✓ In Stock" : "Out of Stock"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(fabric.id);
                            setEditName(fabric.name);
                            setEditCategory(fabric.category);
                            setEditDescription(fabric.description);
                          }}
                          className="border border-primary text-primary px-4 py-2 font-sans text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateFabric(fabric.id)}
                          disabled={duplicatingId === fabric.id}
                          className="border border-neutral-200 text-foreground/70 px-4 py-2 font-sans text-xs uppercase tracking-widest hover:bg-neutral-100 transition-all disabled:opacity-50"
                        >
                          {duplicatingId === fabric.id ? "..." : "Duplicate"}
                        </button>
                        <button
                          onClick={() => handleDeleteFabric(fabric.id)}
                          className="border border-red-200 text-red-400 px-4 py-2 font-sans text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Media Grid */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50">
                      Photos & Videos ({fabric.media.length})
                    </p>
                    <button
                      onClick={() => setPickerFabricId(fabric.id)}
                      className="text-primary font-sans text-xs uppercase tracking-[0.2em] hover:underline"
                    >
                      + Add More
                    </button>
                  </div>

                  {fabric.media.length === 0 ? (
                    <div
                      className="border-2 border-dashed border-neutral-200 p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setPickerFabricId(fabric.id)}
                    >
                      <p className="text-foreground/30 font-sans text-sm">
                        No photos yet — click to add
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {fabric.media.map((item, idx) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragOver={(e) => handleDragOver(e, item.id)}
                          onDragLeave={() => setDragOverMediaId(null)}
                          onDrop={(e) => handleDrop(e, item.id, fabric.id)}
                          className={`relative group cursor-grab active:cursor-grabbing border-2 ${
                            dragOverMediaId === item.id ? "border-primary scale-105 z-10 shadow-lg" : "border-transparent"
                          } transition-all duration-200`}
                        >
                          {/* Thumbnail */}
                          <div className="aspect-square relative overflow-hidden bg-neutral-100">
                            {item.type === "video" ? (
                              <>
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                />
                                {/* Video play overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <Image
                                src={item.url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                            )}

                            {/* PRIMARY badge — only on first item */}
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-accent text-charcoal text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-0.5">
                                ★ Cover
                              </div>
                            )}

                            {/* Hover overlay with remove button */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <button
                                onClick={() => handleDeleteMedia(fabric.id, item.id, item.type)}
                                className="bg-red-500 text-white text-[10px] px-2 py-1 uppercase tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Color tag input */}
                          <input
                            type="text"
                            defaultValue={item.color_tag ?? ""}
                            placeholder={idx === 0 ? "e.g. Wine Red" : "Color name"}
                            maxLength={40}
                            onBlur={async (e) => {
                              const val = e.target.value.trim();
                              // Update locally
                              setFabrics(prev => prev.map(f =>
                                f.id === fabric.id
                                  ? { ...f, media: f.media.map(m => m.id === item.id ? { ...m, color_tag: val || null } : m) }
                                  : f
                              ));
                              await fetch(`/api/admin/media/${item.id}/color`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ colorTag: val || null }),
                              });
                            }}
                            className="w-full mt-1 px-2 py-1 text-[10px] font-sans border border-neutral-200 focus:outline-none focus:border-accent text-foreground/70 placeholder-foreground/30 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
