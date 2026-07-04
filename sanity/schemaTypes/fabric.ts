import {defineField, defineType} from 'sanity'

export const fabric = defineType({
  name: 'fabric',
  title: 'Fabric Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Fabric Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Lace', value: 'lace'},
          {title: 'Sequins', value: 'sequins'},
          {title: 'Stones', value: 'stones'},
          {title: 'Asoebi Packages', value: 'asoebi'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Fabric Image',
      type: 'image',
      options: {
        hotspot: true, // Allows Aunt Joy to crop the image inside Sanity
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO.',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description of the fabric, colors, and quality.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
