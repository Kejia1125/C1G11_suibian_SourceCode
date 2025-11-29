"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Zap, TrendingUp, Building2 } from "lucide-react"

interface TabsNavigationProps {
  overviewContent: React.ReactNode
  energyContent: React.ReactNode
  analyticsContent: React.ReactNode
  roomsContent: React.ReactNode
}

export function TabsNavigation({
  overviewContent,
  energyContent,
  analyticsContent,
  roomsContent,
}: TabsNavigationProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
          <Activity className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="energy" className="flex items-center gap-2 py-3">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Energy</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2 py-3">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="rooms" className="flex items-center gap-2 py-3">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Rooms</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        {overviewContent}
      </TabsContent>

      <TabsContent value="energy" className="mt-6">
        {energyContent}
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        {analyticsContent}
      </TabsContent>

      <TabsContent value="rooms" className="mt-6">
        {roomsContent}
      </TabsContent>
    </Tabs>
  )
}
