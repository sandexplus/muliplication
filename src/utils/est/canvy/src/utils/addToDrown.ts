import { Element } from '@/utils/est/canvy/src/types'

export const addToDrown = (drownElements: Element[], element: Element): Element[] => {
  const test = [...drownElements]
  test.push(element)
  test.sort((a, b) => {
    return a.params.z - b.params.z
  })

  return test
}
