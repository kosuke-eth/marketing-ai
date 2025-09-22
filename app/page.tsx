"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Bot, Upload } from "lucide-react"

// Sample data for charts
const roiData = [
  { channel: "TV", roi: 1.8 },
  { channel: "デジタル", roi: 2.4 },
  { channel: "OOH", roi: 1.2 },
]

const elasticityData = [
  { channel: "TV", elasticity: 0.35 },
  { channel: "デジタル", elasticity: 0.45 },
  { channel: "OOH", elasticity: 0.2 },
]

const salesForecastData = [
  { month: "2025-01", actual: 1100, forecast: 950 },
  { month: "2025-02", actual: 950, forecast: 900 },
  { month: "2025-03", actual: 1050, forecast: 980 },
  { month: "2025-04", actual: 1200, forecast: 1150 },
  { month: "2025-05", actual: 1100, forecast: 1050 },
  { month: "2025-06", actual: 1050, forecast: 950 },
  { month: "2025-07", actual: 1150, forecast: 1100 },
  { month: "2025-08", actual: 1000, forecast: 950 },
  { month: "2025-09", actual: 1100, forecast: 1050 },
  { month: "2025-10", actual: 1150, forecast: 1100 },
  { month: "2025-11", actual: 1050, forecast: 1000 },
  { month: "2025-12", actual: 1100, forecast: 950 },
]

const topSkuData = [
  { name: "ぶっちょ グレープ", distribution: "85%", priceIndex: "1", sales: 1540, change: "+8.2%" },
  { name: "忍者めし コーラ", distribution: "72%", priceIndex: "0.98", sales: 1320, change: "+5.6%" },
  { name: "e-maのど飴 クリスタルグレープ", distribution: "80%", priceIndex: "1.05", sales: 1180, change: "-1.2%" },
  { name: "シゲキックス ソーダ", distribution: "68%", priceIndex: "0.97", sales: 990, change: "+3.1%" },
]

const timeSeriesData = [
  { month: "2025-02", sales: 1100, digitalImp: 120, snsEng: 100, tvGrp: 110, searchIndex: 105 },
  { month: "2025-03", sales: 950, digitalImp: 140, snsEng: 115, tvGrp: 125, searchIndex: 110 },
  { month: "2025-04", sales: 1000, digitalImp: 160, snsEng: 130, tvGrp: 140, searchIndex: 115 },
  { month: "2025-05", sales: 1200, digitalImp: 180, snsEng: 145, tvGrp: 155, searchIndex: 120 },
  { month: "2025-06", sales: 1100, digitalImp: 170, snsEng: 135, tvGrp: 145, searchIndex: 115 },
  { month: "2025-07", sales: 1150, digitalImp: 185, snsEng: 150, tvGrp: 160, searchIndex: 125 },
  { month: "2025-08", sales: 1000, digitalImp: 175, snsEng: 140, tvGrp: 150, searchIndex: 120 },
  { month: "2025-09", sales: 1100, digitalImp: 190, snsEng: 155, tvGrp: 165, searchIndex: 130 },
  { month: "2025-10", sales: 1150, digitalImp: 180, snsEng: 145, tvGrp: 155, searchIndex: 125 },
  { month: "2025-11", sales: 1000, digitalImp: 170, snsEng: 135, tvGrp: 145, searchIndex: 115 },
  { month: "2025-12", sales: 1100, digitalImp: 175, snsEng: 140, tvGrp: 150, searchIndex: 120 },
]

const weeklyAdSpendData = [
  { week: "2025-02 W2", ooh: 15, tv: 35, digital: 25, sales: 250 },
  { week: "2025-03 W1", ooh: 18, tv: 40, digital: 30, sales: 270 },
  { week: "2025-04 W1", ooh: 20, tv: 45, digital: 35, sales: 320 },
  { week: "2025-05 W4", ooh: 22, tv: 38, digital: 28, sales: 280 },
  { week: "2025-07 W3", ooh: 16, tv: 42, digital: 32, sales: 290 },
  { week: "2025-09 W2", ooh: 25, tv: 50, digital: 40, sales: 315 },
  { week: "2025-11 W1", ooh: 28, tv: 48, digital: 38, sales: 310 },
  { week: "2025-12 W4", ooh: 30, tv: 45, digital: 35, sales: 300 },
]

const adAllocationData = [
  { name: "TV", value: 0.46, color: "#8884d8" },
  { name: "デジタル", value: 0.38, color: "#82ca9d" },
  { name: "OOH", value: 0.16, color: "#ffc658" },
]

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState("分析")
  const [profitRoi, setProfitRoi] = useState(false)
  const [benchmark, setBenchmark] = useState(false)
  const [question, setQuestion] = useState("")
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; type: "user" | "ai"; content: string; timestamp: Date }>
  >([])
  const [selectedBrand, setSelectedBrand] = useState("uha")
  const [selectedPeriod, setSelectedPeriod] = useState("2025")
  const [selectedGranularity, setSelectedGranularity] = useState("monthly")
  const [selectedArea, setSelectedArea] = useState("national")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSendQuestion = () => {
    if (question.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        type: "user" as const,
        content: question,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai" as const,
          content: `ご質問「${question}」についてお答えします。現在のデータを分析すると、デジタルチャネルが最も高いROI（2.4）を示しており、来月の売上向上には効果的と考えられます。TVチャネルのROI改善には、ターゲティングの最適化とクリエイティブの見直しをお勧めします。詳細な分析結果は各タブのチャートをご確認ください。`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, aiResponse])
      }, 1000)

      setQuestion("")
    }
  }

  const handleUploadData = () => {
    setShowUploadDialog(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      // Simulate upload process
      console.log("Uploading file:", selectedFile.name)
      setShowUploadDialog(false)
      setSelectedFile(null)

      // Add success message to chat
      const uploadMessage = {
        id: Date.now().toString(),
        type: "ai" as const,
        content: `ファイル「${selectedFile.name}」のアップロードが完了しました。データの処理を開始します。`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, uploadMessage])
    }
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-green-600 px-4 py-2 rounded text-sm font-medium text-white">
            マーケティング分析AI | UHA味覚糖デモ
          </div>
          <div className="text-sm text-gray-600">パフォーマンス向上 / 分析・予測</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 bg-transparent"
            onClick={handleUploadData}
          >
            <Upload className="w-4 h-4 mr-2" />
            最新データをアップロード
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>最新データをアップロード</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">ファイルをドラッグ&ドロップ</p>
              <p className="text-sm text-gray-500 mb-4">または</p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx,.json"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                className="border-gray-300 bg-transparent"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                ファイルを選択
              </Button>
              {selectedFile && <p className="text-sm text-green-600 mt-2">選択されたファイル: {selectedFile.name}</p>}
            </div>
            <div className="text-xs text-gray-500">
              対応形式: CSV, Excel (.xlsx), JSON
              <br />
              最大ファイルサイズ: 10MB
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                キャンセル
              </Button>
              <Button
                className="bg-gray-800 hover:bg-gray-700 text-white"
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                アップロード
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Section */}
      <Card className="mb-8 border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-black text-xl">
            <Bot className="w-6 h-6" />
            AIアシスタントに聞く
          </CardTitle>
          <p className="text-gray-600 text-base leading-relaxed">
            自然言語で質問してください。最新データの取り込みは右上の「最新データをアップロード」から。
          </p>
          <p className="text-gray-600 text-base">例）来月の売上に効いているチャネルは？/ TVのROIを上げるには？</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {chatMessages.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" && <Bot className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-gray-800 text-white" : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    {message.type === "ai" && <p className="text-blue-900 font-medium mb-1">AIアシスタント:</p>}
                    <p className={message.type === "user" ? "text-white" : "text-blue-800"}>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-gray-300" : "text-blue-600"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.type === "user" && <div className="w-5 h-5 bg-gray-800 rounded-full mt-1 flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Input
              placeholder="質問を入力してください..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 border-gray-300 text-lg py-3"
              onKeyPress={(e) => e.key === "Enter" && handleSendQuestion()}
            />
            <Button onClick={handleSendQuestion} className="bg-gray-800 hover:bg-gray-700 text-white px-6">
              送信
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => {
                setQuestion("今日の売上の要因は？")
                handleSendQuestion()
              }}
            >
              今日の売上の要因は？
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => {
                setQuestion("TVのROIを改善するには？")
                handleSendQuestion()
              }}
            >
              TVのROIを改善するには？
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => {
                setQuestion("最新データの取り込み方法は？")
                handleSendQuestion()
              }}
            >
              最新データの取り込み方法は？
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6">
        {["分析", "予測", "トレンド"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab ? "bg-gray-800 text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"
            }
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Conditional Rendering based on active tab */}
      {activeTab === "予測" && (
        <div className="space-y-8">
          {/* Sales Forecast Chart */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                売上予測
              </CardTitle>
              <p className="text-sm text-gray-600">UHA（全体）| 2025-01～12</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: "2025-01", forecast: 950 },
                    { month: "2025-02", forecast: 920 },
                    { month: "2025-03", forecast: 980 },
                    { month: "2025-04", forecast: 1150 },
                    { month: "2025-05", forecast: 1050 },
                    { month: "2025-06", forecast: 980 },
                    { month: "2025-07", forecast: 1100 },
                    { month: "2025-08", forecast: 950 },
                    { month: "2025-09", forecast: 920 },
                    { month: "2025-10", forecast: 1080 },
                    { month: "2025-11", forecast: 900 },
                    { month: "2025-12", forecast: 950 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#374151"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split("-")[1]}
                  />
                  <YAxis stroke="#374151" tick={{ fontSize: 12 }} domain={[0, 1200]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                    labelStyle={{ color: "#000000" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    name="予測"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2">* 実績未確定のため、予測のみ表示（デモ）。</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">予算シミュレーター（簡易）</CardTitle>
              <p className="text-sm text-gray-600">TV/デジタル/OOHの予算増減（%）→ 売上見込の変化を推定</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-black mb-2 block">TV</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="0" className="border-gray-300 text-center" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black mb-2 block">デジタル</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="0" className="border-gray-300 text-center" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-black mb-2 block">OOH</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="0" className="border-gray-300 text-center" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-6">
                <div className="text-sm text-gray-700 mb-1">
                  売上見込の変化: <span className="font-bold text-black">0.00%</span>
                </div>
                <div className="text-sm text-gray-700">
                  期間内の売上見込（シナリオ）: <span className="font-bold text-black">11.8k件</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-gray-800 hover:bg-gray-700 text-white flex-1">+10% 一括</Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent px-8">
                  リセット
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">予測の内訳（ベースラインとチャネル寄与）</CardTitle>
              <p className="text-sm text-gray-600">最後の月の予測をベース + TV + デジタル + OOH に分解（デモ係数）</p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Custom horizontal stacked bar */}
                <div className="w-full h-16 bg-gray-200 rounded flex overflow-hidden">
                  <div className="bg-gray-400 flex-1" style={{ flexBasis: "60%" }}></div>
                  <div className="bg-blue-500" style={{ flexBasis: "15%" }}></div>
                  <div className="bg-green-500" style={{ flexBasis: "20%" }}></div>
                  <div className="bg-orange-400" style={{ flexBasis: "10%" }}></div>
                </div>

                {/* Scale labels */}
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0</span>
                  <span>250</span>
                  <span>500</span>
                  <span>750</span>
                  <span>1000</span>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span className="text-sm text-gray-700">OOH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-700">TV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-700">デジタル</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-sm text-gray-700">ベース</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "分析" && (
        <>
          {/* Filters */}
          <Card className="mb-8 border-gray-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">ブランド</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uha">UHA（全体）</SelectItem>
                      <SelectItem value="puccho">ぷっちょ</SelectItem>
                      <SelectItem value="ninja">忍者めし</SelectItem>
                      <SelectItem value="ema">e-maのど飴</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">期間</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025-01～12</SelectItem>
                      <SelectItem value="2024">2024-01～12</SelectItem>
                      <SelectItem value="q4-2024">2024 Q4</SelectItem>
                      <SelectItem value="q1-2025">2025 Q1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">粒度</label>
                  <Select value={selectedGranularity} onValueChange={setSelectedGranularity}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">月次</SelectItem>
                      <SelectItem value="weekly">週次</SelectItem>
                      <SelectItem value="daily">日次</SelectItem>
                      <SelectItem value="quarterly">四半期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">エリア</label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">全国</SelectItem>
                      <SelectItem value="kanto">関東</SelectItem>
                      <SelectItem value="kansai">関西</SelectItem>
                      <SelectItem value="chubu">中部</SelectItem>
                      <SelectItem value="kyushu">九州</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Switch checked={benchmark} onCheckedChange={setBenchmark} />
                <span className="text-sm text-gray-600">ベンチマーク表示</span>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">累計売上（期間内）</span>
                  </div>
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">+4.2%</div>
                </div>
                <div className="text-2xl font-bold text-black">12.6k件</div>
                <div className="text-xs text-gray-500">実績集計</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">広告費（合計）</span>
                  </div>
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">-3.1%</div>
                </div>
                <div className="text-2xl font-bold text-black">4.2k万円</div>
                <div className="text-xs text-gray-500">TV/デジタル/OOH</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">予測誤差（WAPE）</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-black">6.2%</div>
                <div className="text-xs text-gray-500">目標: ≤ 12%</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">予測誤差（SMAPE）</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-black">6.5%</div>
                <div className="text-xs text-gray-500">Lower is better</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* MMM/ROI Chart */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">MMM / ROI</CardTitle>
                <p className="text-sm text-gray-600">チャネル別の効果目標（売上ROI）</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={profitRoi} onCheckedChange={setProfitRoi} />
                    <span className="text-sm text-black">利益ROIで表示</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-black">粗利率</span>
                    <span className="text-sm font-bold text-black">40%</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:bg-gray-100">
                    ROI/弾力性とは？
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="channel" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Bar dataKey="roi" fill="#000000" name="売上ROI" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales vs Forecast */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  売上 vs 予測
                </CardTitle>
                <p className="text-sm text-gray-600">UHA（全体）| 2025-01～12 | 月次</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesForecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Line type="monotone" dataKey="forecast" stroke="#3B82F6" strokeDasharray="5 5" name="予測" />
                    <Line type="monotone" dataKey="actual" stroke="#3B82F6" name="実績" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top SKU and Elasticity */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Top SKU */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">トップSKU（売上）</CardTitle>
                <p className="text-sm text-gray-600">直近期間の上位SKU</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSkuData.map((sku, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                      <div>
                        <div className="font-medium text-black">{sku.name}</div>
                        <div className="text-sm text-gray-600">
                          配下率 {sku.distribution} / 価格指数 {sku.priceIndex}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-black">{sku.sales}</div>
                        <div className={`text-sm ${sku.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {sku.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Elasticity */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">弾力性</CardTitle>
                <p className="text-sm text-gray-600">投下1%増で売上がどれだけ動くか</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={elasticityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="channel" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Bar dataKey="elasticity" fill="#000000" name="弾力性" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Chart */}
          <Card className="mb-8 border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">重要指標の時系列</CardTitle>
              <p className="text-sm text-gray-600">
                売上=バー（左軸：千単位）/ TV GRP・Digital Imp・SNS Eng・検索数=ライン（右軸：Index=100）
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis yAxisId="left" stroke="#374151" />
                  <YAxis yAxisId="right" orientation="right" stroke="#374151" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                    labelStyle={{ color: "#000000" }}
                  />
                  <Bar yAxisId="left" dataKey="sales" fill="#1F2937" name="売上" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="digitalImp"
                    stroke="#10B981"
                    name="Digital Imp (Index)"
                  />
                  <Line yAxisId="right" type="monotone" dataKey="snsEng" stroke="#F59E0B" name="SNS Eng (Index)" />
                  <Line yAxisId="right" type="monotone" dataKey="tvGrp" stroke="#3B82F6" name="TV GRP (Index)" />
                  <Line yAxisId="right" type="monotone" dataKey="searchIndex" stroke="#EF4444" name="検索数 (Index)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ad Spend and Allocation */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Weekly Ad Spend */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  広告費と売上（週次）
                </CardTitle>
                <p className="text-sm text-gray-600">OOH/TV/デジタル=積み上げ棒 + 売上ライン（右軸）</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyAdSpendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="week" stroke="#374151" />
                    <YAxis yAxisId="left" stroke="#374151" />
                    <YAxis yAxisId="right" orientation="right" stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Bar yAxisId="left" dataKey="ooh" stackId="a" fill="#F59E0B" name="OOH" />
                    <Bar yAxisId="left" dataKey="tv" stackId="a" fill="#3B82F6" name="TV" />
                    <Bar yAxisId="left" dataKey="digital" stackId="a" fill="#10B981" name="デジタル" />
                    <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#000000" name="売上" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ad Allocation */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  広告費配分
                </CardTitle>
                <p className="text-sm text-gray-600">広告費の配分（期間内）</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={adAllocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ value }) => value.toFixed(2)}
                    >
                      {adAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "トレンド" && (
        <div className="space-y-8">
          {/* Sales and Ad Spend Trends */}
          <div className="grid grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">売上トレンド（3ヶ月移動平均）</CardTitle>
                <p className="text-sm text-gray-600">UHA（全体）| 2025-01～12</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesForecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Line type="monotone" dataKey="actual" stroke="#3B82F6" name="売上" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#3B82F6"
                      strokeDasharray="5 5"
                      name="売上MA(3)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ad Spend Trend */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">広告費トレンド（3ヶ月移動平均）</CardTitle>
                <p className="text-sm text-gray-600">TV/デジタル/OOH 合計</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyAdSpendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="week" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                      labelStyle={{ color: "#000000" }}
                    />
                    <Bar dataKey="ooh" stackId="a" fill="#F59E0B" name="OOH" />
                    <Bar dataKey="tv" stackId="a" fill="#3B82F6" name="TV" />
                    <Bar dataKey="digital" stackId="a" fill="#10B981" name="デジタル" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Integrated Timeline and Watch Settings */}
          <div className="grid grid-cols-2 gap-6">
            {/* Integrated Timeline */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">統合タイムライン（自動リサーチ）</CardTitle>
                <p className="text-sm text-gray-600">
                  登録ブランドの「新商品」「TVCM」「キャンペーン」を Corp / PR TIMES から取得（デモ）
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span className="text-sm">Corporate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span className="text-sm">PR TIMES</span>
                  </div>
                  <span className="text-sm text-gray-600">対象ブランド:</span>
                  <div className="flex gap-2">
                    {["UHA味覚糖", "カンロ", "明治", "ロッテ", "森永製菓"].map((brand) => (
                      <span key={brand} className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white text-sm">リサーチ実行</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">2025-08-20</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">カンロ</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">PR TIMES</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-black">新商品</span>
                      <span className="text-black">ピュレグミ 新味「白桃ソーダ」</span>
                    </div>
                    <p className="text-sm text-gray-600">夏限定の新フレーバーを発売。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watch Settings */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">ウォッチ設定</CardTitle>
                <p className="text-sm text-gray-600">クロール対象（サンプル）</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-black mb-2">UHA味覚糖</div>
                    <div className="text-sm text-gray-600 mb-1">
                      Corp:{" "}
                      <a href="https://www.uha-mikakuto.co.jp/news/" className="text-blue-600 hover:underline">
                        https://www.uha-mikakuto.co.jp/news/
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      PR TIMES:{" "}
                      <a
                        href="https://prtimes.jp/main/html/searchrlp/company_id/1411"
                        className="text-blue-600 hover:underline"
                      >
                        https://prtimes.jp/main/html/searchrlp/company_id/1411
                      </a>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-black mb-2">カンロ</div>
                    <div className="text-sm text-gray-600 mb-1">
                      Corp:{" "}
                      <a href="https://www.kanro.co.jp/news/" className="text-blue-600 hover:underline">
                        https://www.kanro.co.jp/news/
                      </a>
                    </div>
                    <div className="text-sm text-gray-600">
                      PR TIMES:{" "}
                      <a
                        href="https://prtimes.jp/main/html/searchrlp/company_id/16516"
                        className="text-blue-600 hover:underline"
                      >
                        https://prtimes.jp/main/html/searchrlp/company_id/16516
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* News Timeline and Company Information */}
          <div className="grid grid-cols-2 gap-6">
            {/* News Timeline */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">ニュースタイムライン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">2025-07-28</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">森永製菓</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">Corporate</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-black">キャンペーン</span>
                      <span className="text-black">ハイチュウ 夏のBIG袋 企画</span>
                    </div>
                    <p className="text-sm text-gray-600">大型量販店向けに限定パッケージ展開。</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">2025-07-18</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">グリコ</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">Corporate</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-black">新商品</span>
                      <span className="text-black">ポスカのど飴 リフレッシュミント</span>
                    </div>
                    <p className="text-sm text-gray-600">ミント強化で新処方。</p>
                  </div>

                  <div className="border-l-4 border-black pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">2025-07-01</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">市場</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">Report</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="font-medium text-black">レポート</span>
                      <span className="text-black">キャンディ・グミ市場 6月月次レポート</span>
                    </div>
                    <p className="text-sm text-gray-600">グミ市場は前年同月比+9%。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information and Market Reports */}
            <div className="space-y-6">
              {/* Company Information */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">企業情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border border-gray-200 rounded">
                      <div className="font-medium text-black mb-1">ロッテ</div>
                      <div className="text-xs text-gray-600 mb-1">
                        Corp:{" "}
                        <a href="https://www.lotte.co.jp/products/news/" className="text-blue-600 hover:underline">
                          https://www.lotte.co.jp/products/news/
                        </a>
                      </div>
                      <div className="text-xs text-gray-600">
                        PR TIMES:{" "}
                        <a
                          href="https://prtimes.jp/main/html/searchrlp/company_id/2360"
                          className="text-blue-600 hover:underline"
                        >
                          https://prtimes.jp/main/html/searchrlp/company_id/2360
                        </a>
                      </div>
                    </div>

                    <div className="p-3 border border-gray-200 rounded">
                      <div className="font-medium text-black mb-1">森永製菓</div>
                      <div className="text-xs text-gray-600 mb-1">
                        Corp:{" "}
                        <a
                          href="https://www.morinaga.co.jp/company/newsrelease/"
                          className="text-blue-600 hover:underline"
                        >
                          https://www.morinaga.co.jp/company/newsrelease/
                        </a>
                      </div>
                      <div className="text-xs text-gray-600">
                        PR TIMES:{" "}
                        <a
                          href="https://prtimes.jp/main/html/searchrlp/company_id/11676"
                          className="text-blue-600 hover:underline"
                        >
                          https://prtimes.jp/main/html/searchrlp/company_id/11676
                        </a>
                      </div>
                    </div>

                    <div className="p-3 border border-gray-200 rounded">
                      <div className="font-medium text-black mb-1">グリコ</div>
                      <div className="text-xs text-gray-600 mb-1">
                        Corp:{" "}
                        <a href="https://www.glico.com/jp/newscenter/" className="text-blue-600 hover:underline">
                          https://www.glico.com/jp/newscenter/
                        </a>
                      </div>
                      <div className="text-xs text-gray-600">
                        PR TIMES:{" "}
                        <a
                          href="https://prtimes.jp/main/html/searchrlp/company_id/16521"
                          className="text-blue-600 hover:underline"
                        >
                          https://prtimes.jp/main/html/searchrlp/company_id/16521
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Reports */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">市場レポート（カテゴリ）</CardTitle>
                  <p className="text-sm text-gray-600">外部公開情報のメモ</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">2025-07-30</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">富士経済(サンプル)</span>
                      </div>
                      <div className="font-medium text-black underline">キャンディ/グミ市場レポート Q2</div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">2025-07-18</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">SocialPulse(サンプル)</span>
                      </div>
                      <div className="font-medium text-black underline">SNS話題量 月次サマリ（菓子・グミ）</div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">2025-07-05</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">ビデオリサーチ(サンプル)</span>
                      </div>
                      <div className="font-medium text-black underline">TVCM投下量(菓子) 週間</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">© 2025 Brand Engineering AI – Dashboard Demo</div>
    </div>
  )
}
