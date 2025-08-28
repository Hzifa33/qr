"use client"

import type React from "react"
import jsQR from "jsqr"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  QrCode,
  Download,
  Upload,
  Settings,
  Sparkles,
  ImageIcon,
  Globe,
  Wifi,
  User,
  Mail,
  MessageSquare,
  Share2,
  Square,
  Palette,
  Gem,
  Waves,
  Target,
  Grid3X3,
  FileImage,
} from "lucide-react"
import QRCode from "qrcode"

interface QRStyle {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface QRType {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}

const qrStyles: QRStyle[] = [
  { id: "minimal", name: "Minimal Mono", description: "Clean black & white for professional use", icon: Square },
  { id: "gradient", name: "Gradient Glass", description: "Deep gradients with glassmorphism effects", icon: Palette },
  { id: "artdeco", name: "Art Deco", description: "Geometric patterns with elegant borders", icon: Gem },
  { id: "organic", name: "Organic Flow", description: "Flowing organic shapes and patterns", icon: Waves },
  { id: "logo", name: "Logo Integrated", description: "Seamlessly embed your logo", icon: Target },
  { id: "pixel", name: "Pixel Art", description: "Retro pixelated aesthetic", icon: Grid3X3 },
]

const qrTypes: QRType[] = [
  { id: "url", name: "Website URL", icon: Globe },
  { id: "wifi", name: "Wi-Fi Access", icon: Wifi },
  { id: "vcard", name: "Contact Card", icon: User },
  { id: "email", name: "Email", icon: Mail },
  { id: "sms", name: "SMS", icon: MessageSquare },
  { id: "social", name: "Social Media", icon: Share2 },
]

export default function QRGenerator() {
  const [qrType, setQrType] = useState("url")
  const [qrData, setQrData] = useState("")
  const [qrStyle, setQrStyle] = useState("gradient")
  const [qrCode, setQrCode] = useState("")
  const [errorLevel, setErrorLevel] = useState("M")
  const [size, setSize] = useState([300])
  const [margin, setMargin] = useState([4])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")

  const [wifiData, setWifiData] = useState({ ssid: "", password: "", security: "WPA" })
  const [vcardData, setVcardData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    address: "",
  })
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" })
  const [smsData, setSmsData] = useState({ phone: "", message: "" })
  const [socialData, setSocialData] = useState({ platform: "instagram", username: "" })

  const [scannedResult, setScannedResult] = useState("")
  const [scanError, setScanError] = useState("")

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    let dataToEncode = ""

    switch (qrType) {
      case "url":
        dataToEncode = qrData
        break
      case "wifi":
        dataToEncode = `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};;`
        break
      case "vcard":
        dataToEncode = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.firstName} ${vcardData.lastName}\nORG:${vcardData.company}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nADR:${vcardData.address}\nEND:VCARD`
        break
      case "email":
        dataToEncode = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
        break
      case "sms":
        dataToEncode = `sms:${smsData.phone}?body=${encodeURIComponent(smsData.message)}`
        break
      case "social":
        const socialUrls = {
          instagram: `https://instagram.com/${socialData.username}`,
          twitter: `https://twitter.com/${socialData.username}`,
          facebook: `https://facebook.com/${socialData.username}`,
          linkedin: `https://linkedin.com/in/${socialData.username}`,
          tiktok: `https://tiktok.com/@${socialData.username}`,
          youtube: `https://youtube.com/@${socialData.username}`,
        }
        dataToEncode = socialUrls[socialData.platform as keyof typeof socialUrls] || ""
        break
      default:
        dataToEncode = qrData
    }

    if (!dataToEncode.trim()) return

    try {
      let darkColor = "#000000"
      let lightColor = "#FFFFFF"

      switch (qrStyle) {
        case "minimal":
          darkColor = "#000000"
          lightColor = "#FFFFFF"
          break
        case "gradient":
          darkColor = "#0891b2"
          lightColor = "#FFFFFF"
          break
        case "artdeco":
          darkColor = "#1e293b"
          lightColor = "#f8fafc"
          break
        case "organic":
          darkColor = "#059669"
          lightColor = "#ecfdf5"
          break
        case "logo":
          darkColor = "#7c3aed"
          lightColor = "#faf5ff"
          break
        case "pixel":
          darkColor = "#dc2626"
          lightColor = "#fef2f2"
          break
      }

      const options = {
        errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
        type: "image/png" as const,
        quality: 0.92,
        margin: margin[0],
        width: size[0],
        color: {
          dark: darkColor,
          light: lightColor,
        },
      }

      const qrDataURL = await QRCode.toDataURL(dataToEncode, options)

      if (logoPreview && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            canvas.width = size[0]
            canvas.height = size[0]
            ctx.drawImage(img, 0, 0, size[0], size[0])

            const logoImg = new Image()
            logoImg.crossOrigin = "anonymous"
            logoImg.onload = () => {
              const logoSize = size[0] * 0.15
              const logoX = (size[0] - logoSize) / 2
              const logoY = (size[0] - logoSize) / 2

              ctx.fillStyle = "white"
              ctx.beginPath()
              ctx.arc(size[0] / 2, size[0] / 2, logoSize / 2 + 5, 0, 2 * Math.PI)
              ctx.fill()

              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)

              const finalDataURL = canvas.toDataURL("image/png")
              setQrCode(finalDataURL)
            }
            logoImg.src = logoPreview
          }
          img.src = qrDataURL
        }
      } else {
        setQrCode(qrDataURL)
        if (canvasRef.current && qrStyle !== "minimal") {
          applyArtisticEffects(qrDataURL)
        }
      }
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const applyArtisticEffects = (qrDataURL: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = size[0]
      canvas.height = size[0]

      if (qrStyle === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, size[0], size[0])
        gradient.addColorStop(0, "#0891b2")
        gradient.addColorStop(0.5, "#06b6d4")
        gradient.addColorStop(1, "#0ea5e9")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size[0], size[0])
        ctx.globalCompositeOperation = "overlay"
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(0, 0, size[0], size[0])
        ctx.globalCompositeOperation = "multiply"
      } else if (qrStyle === "artdeco") {
        const gradient = ctx.createRadialGradient(size[0] / 2, size[0] / 2, 0, size[0] / 2, size[0] / 2, size[0] / 2)
        gradient.addColorStop(0, "#f8fafc")
        gradient.addColorStop(1, "#e2e8f0")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size[0], size[0])
      } else if (qrStyle === "organic") {
        const gradient = ctx.createLinearGradient(0, 0, size[0], size[0])
        gradient.addColorStop(0, "#ecfdf5")
        gradient.addColorStop(0.5, "#d1fae5")
        gradient.addColorStop(1, "#a7f3d0")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size[0], size[0])
      }

      ctx.drawImage(img, 0, 0, size[0], size[0])
    }
    img.src = qrDataURL
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrCode
    link.click()
  }

  const downloadSVG = async () => {
    let dataToEncode = ""

    switch (qrType) {
      case "url":
        dataToEncode = qrData
        break
      case "wifi":
        dataToEncode = `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};;`
        break
      case "vcard":
        dataToEncode = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.firstName} ${vcardData.lastName}\nORG:${vcardData.company}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nADR:${vcardData.address}\nEND:VCARD`
        break
      case "email":
        dataToEncode = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
        break
      case "sms":
        dataToEncode = `sms:${smsData.phone}?body=${encodeURIComponent(smsData.message)}`
        break
      case "social":
        const socialUrls = {
          instagram: `https://instagram.com/${socialData.username}`,
          twitter: `https://twitter.com/${socialData.username}`,
          facebook: `https://facebook.com/${socialData.username}`,
          linkedin: `https://linkedin.com/in/${socialData.username}`,
          tiktok: `https://tiktok.com/@${socialData.username}`,
          youtube: `https://youtube.com/@${socialData.username}`,
        }
        dataToEncode = socialUrls[socialData.platform as keyof typeof socialUrls] || ""
        break
      default:
        dataToEncode = qrData
    }

    if (!dataToEncode.trim()) return

    try {
      let darkColor = "#000000"
      let lightColor = "#FFFFFF"

      switch (qrStyle) {
        case "minimal":
          darkColor = "#000000"
          lightColor = "#FFFFFF"
          break
        case "gradient":
          darkColor = "#0891b2"
          lightColor = "#FFFFFF"
          break
        case "artdeco":
          darkColor = "#1e293b"
          lightColor = "#f8fafc"
          break
        case "organic":
          darkColor = "#059669"
          lightColor = "#ecfdf5"
          break
        case "logo":
          darkColor = "#7c3aed"
          lightColor = "#faf5ff"
          break
        case "pixel":
          darkColor = "#dc2626"
          lightColor = "#fef2f2"
          break
      }

      const options = {
        errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
        type: "svg" as const,
        margin: margin[0],
        width: size[0],
        color: {
          dark: darkColor,
          light: lightColor,
        },
      }

      const svgString = await QRCode.toString(dataToEncode, options)
      const blob = new Blob([svgString], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `qr-code-${Date.now()}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating SVG:", error)
    }
  }

  const downloadPDF = () => {
    if (!qrCode) return

    try {
      // Create a new canvas for PDF generation
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        // Set canvas size for high-quality PDF (A4 proportions)
        const pdfWidth = 595 // A4 width in points
        const pdfHeight = 842 // A4 height in points
        const qrSize = Math.min(pdfWidth, pdfHeight) * 0.6 // 60% of page size

        canvas.width = pdfWidth
        canvas.height = pdfHeight

        // Fill white background
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, pdfWidth, pdfHeight)

        // Center the QR code
        const x = (pdfWidth - qrSize) / 2
        const y = (pdfHeight - qrSize) / 2

        ctx.drawImage(img, x, y, qrSize, qrSize)

        // Convert canvas to PDF-compatible data URL
        const dataURL = canvas.toDataURL("image/jpeg", 0.95)

        // Create simple PDF content
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${pdfWidth} ${pdfHeight}]
/Contents 4 0 R
/Resources <<
  /XObject <<
    /Im1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
q
${qrSize} 0 0 ${qrSize} ${x} ${y} cm
/Im1 Do
Q
endstream
endobj

5 0 obj
<<
/Type /XObject
/Subtype /Image
/Width ${size[0]}
/Height ${size[0]}
/ColorSpace /DeviceRGB
/BitsPerComponent 8
/Filter /DCTDecode
/Length ${dataURL.length}
>>
stream
${dataURL}
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000000380 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${500 + dataURL.length}
%%EOF`

        // For simplicity, we'll use the canvas approach to create a downloadable image in PDF format
        // This creates a high-quality image that can be used in PDF workflows
        const link = document.createElement("a")
        link.download = `qr-code-${Date.now()}.pdf`

        // Convert canvas to blob and create PDF-like download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a simple PDF wrapper (this is a simplified approach)
              const url = URL.createObjectURL(blob)

              // For a proper PDF, we'll create a data URL that browsers can handle
              const pdfDataUrl = canvas.toDataURL("image/png")

              // Create a simple HTML page that can be printed as PDF
              const htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>QR Code</title>
                <style>
                  body { margin: 0; padding: 20px; text-align: center; }
                  img { max-width: 100%; height: auto; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>
                <img src="${pdfDataUrl}" alt="QR Code" />
              </body>
              </html>
            `

              const htmlBlob = new Blob([htmlContent], { type: "text/html" })
              const htmlUrl = URL.createObjectURL(htmlBlob)

              // Open in new window for PDF printing/saving
              const newWindow = window.open(htmlUrl, "_blank")
              if (newWindow) {
                newWindow.onload = () => {
                  setTimeout(() => {
                    newWindow.print()
                    URL.revokeObjectURL(htmlUrl)
                  }, 500)
                }
              }
            }
          },
          "image/png",
          0.95,
        )
      }
      img.src = qrCode
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setScanError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qrData = detectQRFromImageData(imageData)

        if (qrData) {
          setScannedResult(qrData)
          handleQRAction(qrData)
        } else {
          setScanError("No QR code found in image")
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        // Create a synthetic event to reuse handleImageUpload logic
        const syntheticEvent = {
          target: { files: [file] },
        } as React.ChangeEvent<HTMLInputElement>
        handleImageUpload(syntheticEvent)
      }
    }
  }

  const handleQRAction = (qrData: string) => {
    try {
      // WiFi QR Code
      if (qrData.startsWith("WIFI:")) {
        const wifiMatch = qrData.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/)
        if (wifiMatch) {
          const [, security, ssid, password] = wifiMatch
          // For mobile devices, try to open WiFi settings
          if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Android WiFi intent
            if (/Android/i.test(navigator.userAgent)) {
              window.location.href = `intent://wifi#Intent;scheme=wifi;package=com.android.settings;S.ssid=${encodeURIComponent(ssid)};S.password=${encodeURIComponent(password)};end`
            }
          } else {
            // Desktop: Show WiFi details
            alert(`WiFi Network: ${ssid}\nPassword: ${password}\nSecurity: ${security}`)
          }
        }
        return
      }

      // Email QR Code
      if (qrData.startsWith("mailto:")) {
        window.location.href = qrData
        return
      }

      // SMS QR Code
      if (qrData.startsWith("sms:")) {
        window.location.href = qrData
        return
      }

      // Phone QR Code
      if (qrData.startsWith("tel:")) {
        window.location.href = qrData
        return
      }

      // vCard QR Code
      if (qrData.startsWith("BEGIN:VCARD")) {
        // Create a blob and download the vCard
        const blob = new Blob([qrData], { type: "text/vcard" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "contact.vcf"
        link.click()
        URL.revokeObjectURL(url)
        return
      }

      // Geo location QR Code
      if (qrData.startsWith("geo:")) {
        const geoMatch = qrData.match(/geo:([^,]+),([^,?]+)/)
        if (geoMatch) {
          const [, lat, lng] = geoMatch
          // Open in maps application
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = `maps://maps.google.com/maps?q=${lat},${lng}`
          } else {
            window.location.href = `https://maps.google.com/maps?q=${lat},${lng}`
          }
        }
        return
      }

      // URL QR Code (HTTP/HTTPS)
      if (qrData.startsWith("http://") || qrData.startsWith("https://")) {
        window.open(qrData, "_blank")
        return
      }

      // Calendar event QR Code
      if (qrData.startsWith("BEGIN:VEVENT")) {
        // Create a blob and download the calendar event
        const blob = new Blob([qrData], { type: "text/calendar" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "event.ics"
        link.click()
        URL.revokeObjectURL(url)
        return
      }

      // Social media or other URLs
      if (
        qrData.includes("instagram.com") ||
        qrData.includes("twitter.com") ||
        qrData.includes("facebook.com") ||
        qrData.includes("linkedin.com") ||
        qrData.includes("tiktok.com") ||
        qrData.includes("youtube.com")
      ) {
        window.open(qrData, "_blank")
        return
      }

      // Default: if it looks like a URL, open it
      try {
        new URL(qrData)
        window.open(qrData, "_blank")
      } catch {
        // Not a valid URL, just display the result
        console.log("QR Code content:", qrData)
      }
    } catch (error) {
      console.error("Error handling QR action:", error)
    }
  }

  const detectQRFromImageData = (imageData: ImageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    return code ? code.data : null
  }

  useEffect(() => {
    generateQR()
  }, [
    qrType,
    qrData,
    qrStyle,
    errorLevel,
    size,
    margin,
    wifiData,
    vcardData,
    emailData,
    smsData,
    socialData,
    logoPreview,
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "var(--font-montserrat)" }}>
              QR Studio
            </h1>
          </div>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Create stunning, professional QR codes with artistic effects and advanced customization
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  QR Code Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">QR Code Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {qrTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <Button
                          key={type.id}
                          variant={qrType === type.id ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={() => setQrType(type.id)}
                        >
                          <IconComponent className="w-6 h-6 text-current" />
                          <span className="text-xs">{type.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="qr-content">Content</Label>
                  {qrType === "url" && (
                    <Input
                      id="qr-content"
                      placeholder="https://example.com"
                      value={qrData}
                      onChange={(e) => setQrData(e.target.value)}
                      className="mt-2"
                    />
                  )}
                  {qrType === "wifi" && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder="Network Name (SSID)"
                        value={wifiData.ssid}
                        onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                      />
                      <Input
                        placeholder="Password"
                        type="password"
                        value={wifiData.password}
                        onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                      />
                      <Select
                        value={wifiData.security}
                        onValueChange={(value) => setWifiData({ ...wifiData, security: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Security Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {qrType === "vcard" && (
                    <div className="space-y-3 mt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="First Name"
                          value={vcardData.firstName}
                          onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                        />
                        <Input
                          placeholder="Last Name"
                          value={vcardData.lastName}
                          onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                        />
                      </div>
                      <Input
                        placeholder="Company"
                        value={vcardData.company}
                        onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                      />
                      <Input
                        placeholder="Phone"
                        value={vcardData.phone}
                        onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        value={vcardData.email}
                        onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                      />
                      <Textarea
                        placeholder="Address"
                        value={vcardData.address}
                        onChange={(e) => setVcardData({ ...vcardData, address: e.target.value })}
                      />
                    </div>
                  )}
                  {qrType === "email" && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder="Recipient Email"
                        value={emailData.to}
                        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                      />
                      <Input
                        placeholder="Subject"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      />
                      <Textarea
                        placeholder="Message Body"
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      />
                    </div>
                  )}
                  {qrType === "sms" && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder="Phone Number"
                        value={smsData.phone}
                        onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
                      />
                      <Textarea
                        placeholder="Message"
                        value={smsData.message}
                        onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                      />
                    </div>
                  )}
                  {qrType === "social" && (
                    <div className="space-y-3 mt-2">
                      <Select
                        value={socialData.platform}
                        onValueChange={(value) => setSocialData({ ...socialData, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Social Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Username (without @)"
                        value={socialData.username}
                        onChange={(e) => setSocialData({ ...socialData, username: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Visual Style</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {qrStyles.map((style) => {
                      const IconComponent = style.icon
                      return (
                        <Button
                          key={style.id}
                          variant={qrStyle === style.id ? "default" : "outline"}
                          className="h-auto p-4 flex items-center gap-3 text-left justify-start"
                          onClick={() => setQrStyle(style.id)}
                        >
                          <IconComponent className="w-6 h-6 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm leading-tight">{style.name}</div>
                            <div className="text-xs text-muted-foreground leading-tight mt-1 text-balance">
                              {style.description}
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <Label className="font-medium">Advanced Settings</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Error Correction</Label>
                      <Select value={errorLevel} onValueChange={setErrorLevel}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Size: {size[0]}px</Label>
                      <Slider value={size} onValueChange={setSize} max={800} min={200} step={50} className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Logo Integration</Label>
                    <div className="mt-2 flex items-center gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </Button>
                      {logoPreview && (
                        <div className="w-8 h-8 rounded border overflow-hidden">
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-4">
                  {qrCode ? (
                    <img
                      src={qrCode || "/placeholder.svg"}
                      alt="Generated QR Code"
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>Enter content to generate QR code</p>
                    </div>
                  )}
                </div>

                {qrCode && (
                  <div className="space-y-3">
                    <Button onClick={downloadQR} className="w-full" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={downloadSVG}>
                        SVG
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadPDF}>
                        PDF
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">High-resolution exports available</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-primary" />
                  QR Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <FileImage className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop an image here, or click to select</p>
                  <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </Button>
                </div>

                {scannedResult && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">QR Code Detected:</p>
                    <p className="text-sm text-green-700 break-all">{scannedResult}</p>
                  </div>
                )}

                {scanError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{scanError}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Upload images containing QR codes for instant scanning and action
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
