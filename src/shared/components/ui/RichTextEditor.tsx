import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

type RichTextEditorProps = {
  value?: string
  placeholder?: string
  minHeight?: number
  onChange?: (value: string) => void
  disabled?: boolean
}

export default function RichTextEditor({
  value = '',
  placeholder = 'Write here...',
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<Quill | null>(null)
  const isInitializingRef = useRef(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!editorRef.current || quillRef.current || isInitializingRef.current) return

    isInitializingRef.current = true
    editorRef.current.innerHTML = ''

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: true,
      },
    })

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value)
    }

    quill.on('text-change', () => {
      const html = quill.root.innerHTML
      onChangeRef.current?.(html === '<p><br></p>' ? '' : html)
    })

    quillRef.current = quill
    isInitializingRef.current = false
  }, [])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return

    const currentValue = quill.root.innerHTML
    const nextValue = value || ''

    if (currentValue !== nextValue) {
      quill.clipboard.dangerouslyPasteHTML(nextValue)
    }
  }, [value])

  return (
    <div className="bg-background focus-within:ring-ring overflow-hidden rounded-[16px] border border-[#DFE3E6] focus-within:ring-1">
      <div ref={editorRef} className="text-editor" />
    </div>
  )
}
