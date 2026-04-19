import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'valuesBlock',
  interfaceName: 'ValuesBlock',
  labels: {
    plural: 'Values sections',
    singular: 'Values',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Values',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Values',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional small illustration or icon (square works best).',
          },
        },
      ],
    },
  ],
}
