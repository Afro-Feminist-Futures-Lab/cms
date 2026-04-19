import React from 'react'

import type { ValuesBlock as ValuesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const ValuesBlock: React.FC<ValuesBlockProps> = ({ heading, items }) => {
  return (
    <section className="affl-values-block container" data-block-type="values">
      {heading ? <h2 className="affl-values-block-title">{heading}</h2> : null}
      <div className="affl-values-block-grid">
        {items?.map((item, index) => (
          <article className="affl-values-block-card" key={item.id ?? index}>
            {item.icon && typeof item.icon === 'object' ? (
              <div className="affl-values-block-icon">
                <Media
                  imgClassName="h-full w-full object-contain"
                  resource={item.icon}
                />
              </div>
            ) : null}
            <div className="affl-values-block-body">
              {item.title ? <h3 className="affl-values-block-item-title">{item.title}</h3> : null}
              {item.description ? (
                <p className="affl-values-block-item-desc">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
