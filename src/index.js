const qr = require('qr-image')

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)
		
		if (url.pathname !== '/') {
			return new Response('404 page not found', { status: 404 })
		}
		
		const content = url.searchParams.get('c') || ''
		let l = url.searchParams.get('l') || ''
		let s = +url.searchParams.get('s') || undefined
		let ext = url.searchParams.get('ext') || ''
		
		if (!content) {
			return new Response('empty content', { status: 400 })
		}
		if (!['L', 'M', 'Q', 'H'].includes(l)) {
			l = 'M'
		}
		if (!['png', 'svg'].includes(ext)) {
			ext = 'png'
		}
		if (!s) {
			s = ext === 'png' ? 4 : 1
		}
		
		console.log(`generate: c=${content}, ext=${ext}, l=${l}, s=${s}`)
		
		const img = qr.imageSync(content, {
			type: ext,
			ec_level: l,
			size: s
		})
		
		return new Response(img, {
			headers: {
				'content-type': {
					png: 'image/png',
					svg: 'image/svg+xml'
				}[ext],
				'cache-control': 'public, max-age=31536000, immutable'
			}
		})
	}
}
