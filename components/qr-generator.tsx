"use client"

import type React from "react"

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
  Camera,
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
                      <Button variant="outline" size="sm">
                        SVG
                      </Button>
                      <Button variant="outline" size="sm">
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
                  <Camera className="w-5 h-5 text-primary" />
                  QR Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Scan existing QR codes with your camera
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
