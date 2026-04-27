import createImageUrlBuilder from '@sanity/image-url'
import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps} from 'next-sanity'
import {getImageDimensions} from '@sanity/asset-utils'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

function urlForImage(source: any) {
  if (!source?.asset?._ref) return undefined

  const imageRef = source.asset._ref
  const crop = source.crop
  const {width, height} = getImageDimensions(imageRef)

  if (crop) {
    const croppedWidth = Math.floor(width * (1 - (crop.right + crop.left)))
    const croppedHeight = Math.floor(height * (1 - (crop.top + crop.bottom)))
    const left = Math.floor(width * crop.left)
    const top = Math.floor(height * crop.top)
    return imageBuilder.image(source).rect(left, top, croppedWidth, croppedHeight).auto('format')
  }

  return imageBuilder.image(source).auto('format')
}

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return
  const url = urlForImage(image)?.width(width).height(height).fit('crop').url()
  if (!url) return
  return {url, alt: image?.alt as string, width, height}
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}
