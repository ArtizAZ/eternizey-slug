'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectClient({ slug }: { slug: string }) {
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`https://eternizey.com/${slug}`)
        }, 1000) // 1 segundo

        return () => clearTimeout(timer)
    }, [slug])

    return null
}
