import { Element, Group } from '@/utils/canvy/types'

export const isElement = (element: Element | Group) => {
  return !(element as Group).group
}
