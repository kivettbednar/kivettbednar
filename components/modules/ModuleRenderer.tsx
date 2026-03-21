import React from 'react'
import {Hero} from './Hero'
import {RichText} from './RichText'
import {ImageGallery} from './ImageGallery'
import {FeatureGrid} from './FeatureGrid'
import {CtaBanner} from './CtaBanner'
import {VideoEmbed} from './VideoEmbed'
import {MusicEmbed} from './MusicEmbed'
import {Testimonials} from './Testimonials'
import {FAQ} from './FAQ'
import {dataAttr} from '@/sanity/lib/utils'

type ModuleProps =
  | ({_type: 'hero'; _key: string} & React.ComponentProps<typeof Hero>)
  | ({_type: 'richText'; _key: string} & React.ComponentProps<typeof RichText>)
  | ({_type: 'imageGallery'; _key: string} & React.ComponentProps<typeof ImageGallery>)
  | ({_type: 'featureGrid'; _key: string} & React.ComponentProps<typeof FeatureGrid>)
  | ({_type: 'ctaBanner'; _key: string} & React.ComponentProps<typeof CtaBanner>)
  | ({_type: 'videoEmbed'; _key: string} & React.ComponentProps<typeof VideoEmbed>)
  | ({_type: 'musicEmbed'; _key: string} & React.ComponentProps<typeof MusicEmbed>)
  | ({_type: 'testimonials'; _key: string} & React.ComponentProps<typeof Testimonials>)
  | ({_type: 'faq'; _key: string} & React.ComponentProps<typeof FAQ>)

type Props = {
  modules?: ModuleProps[]
  pageId?: string
  pageType?: string
  fieldPath?: string
}

export function ModuleRenderer({modules, pageId, pageType, fieldPath = 'modules'}: Props) {
  if (!modules || modules.length === 0) {
    return null
  }

  return (
    <div className="space-y-16">
      {modules.map((module) => {
        const wrapperAttr =
          pageId && pageType
            ? dataAttr({id: pageId, type: pageType, path: `${fieldPath}[_key=="${module._key}"]`}).toString()
            : undefined
        const wrapperProps = wrapperAttr ? {'data-sanity': wrapperAttr} : {}
        switch (module._type) {
          case 'hero':
            return (
              <div key={module._key} {...wrapperProps}>
                <Hero {...module} />
              </div>
            )
          case 'richText':
            return (
              <div key={module._key} {...wrapperProps}>
                <RichText {...module} />
              </div>
            )
          case 'imageGallery':
            return (
              <div key={module._key} {...wrapperProps}>
                <ImageGallery {...module} />
              </div>
            )
          case 'featureGrid':
            return (
              <div key={module._key} {...wrapperProps}>
                <FeatureGrid {...module} />
              </div>
            )
          case 'ctaBanner':
            return (
              <div key={module._key} {...wrapperProps}>
                <CtaBanner {...module} />
              </div>
            )
          case 'videoEmbed':
            return (
              <div key={module._key} {...wrapperProps}>
                <VideoEmbed {...module} />
              </div>
            )
          case 'musicEmbed':
            return (
              <div key={module._key} {...wrapperProps}>
                <MusicEmbed {...module} />
              </div>
            )
          case 'testimonials':
            return (
              <div key={module._key} {...wrapperProps}>
                <Testimonials {...module} />
              </div>
            )
          case 'faq':
            return (
              <div key={module._key} {...wrapperProps}>
                <FAQ {...module} />
              </div>
            )
      default:
        console.warn(`Unknown module type: ${(module as {_type: string})._type}`)
        return null
        }
      })}
    </div>
  )
}
