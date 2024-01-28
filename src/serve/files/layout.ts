import { load } from 'cheerio'


export function layout(template: string, html: string) {
  const $ = load(template)
  const $$ = load(html)

  const slots: { [name: string]: string } = {}

  $$(':is(head,body)>[slot]').each((_, el) => {
    const $el = $$(el)
    const name = $el.attr('slot')!

    if ($(`slot[name="${name}"]`).length > 0) {
      slots[name] ??= ''
      slots[name] += $el.html()!
      $el.remove()
    }
  })

  $('slot').each((_, el) => {
    const $el = $(el)
    if ($el.attr('name')) {
      $(el).replaceWith(slots[$(el).attr('name')!] || '')
    } else {
      $(el).replaceWith($$.html())
    }
  })

  return $.html()
}
