// components/PDFViewer.js
import { useEffect, useRef } from "react"

export default function PDFViewer({ url }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    if (iframeRef.current && url) {
      iframeRef.current.src = url
    }
  }, [url])

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <iframe
        ref={iframeRef}
        title="Newsletter PDF"
        width="100%"
        height="600px"
        className="w-full"
      />
    </div>
  )
}
