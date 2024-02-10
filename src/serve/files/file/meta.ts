import { load } from 'cheerio'


export function meta(html: string, data: {[key: string]: any}) {
  const $ = load(html)

  Object.keys(data).forEach(key => {
    const value = data[key]

    if (key === 'title') {
      $('head title').remove()
      $('head').append(`<title>${value}</title>`)
    } else if (key === 'base') {
      $('head base').remove()
      $('head').append(`<base href="${value}">`)
    } else if (key === 'keywords') {
      $('head meta[name="keywords"]').remove()
      $('head').append(`<meta name="keywords" content="${value.join(', ')}">`)
    } else if (key !== 'layout') {
      $(`head meta[name="${key}"]`).remove()
      $('head').append(`<meta name="${key}" content="${value}">`)
    }
  })

  return $.html()
}
