import { load } from 'cheerio'


export function layout(template: string, html: string) {
  const $ = load(template)
  const $$ = load(html)

  const slots: { [name: string]: string } = {}

  $$('body>[slot]').each((_, el) => {
    const $el = $$(el)
    const name = $el.attr('slot')!

    if ($(`slot[name="${name}"]`).length > 0) {
      slots[name] ??= ''
      slots[name] += $el.prop('outerHTML')!
      $el.remove()
    }
  })

  $('slot').each((_, el) => {
    const $el = $(el)
    const name = $el.attr('name')
    if (name) {
      if (slots[name]) {
        $(el).replaceWith(slots[name]!)
      }
    } else {
      $(el).replaceWith($$.html())
    }
  })

  return $.html()
}
