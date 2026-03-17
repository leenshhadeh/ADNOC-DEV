import { ChevronDown, Download, Filter, Layers, Search, Upload } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export type CatalogTabValue = "processes" | "myTasks" | "submittedRequests"

interface CatalogHeaderProps {
  activeTab: CatalogTabValue
  onTabChange: (value: CatalogTabValue) => void
}

const CatalogHeader = ({ activeTab, onTabChange }: CatalogHeaderProps) => {
  return (
    <header className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="font-medium text-primary hover:text-primary/80">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">Process Catalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-semibold text-foreground text-start">Process Catalog</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="default" className="h-9 rounded-xl px-3">
            <Layers className="size-4" />
            Bulk Action
            <ChevronDown className="size-4" />
          </Button>

          <Button type="button" variant="outline" className="h-9 rounded-xl px-3">
            <Upload className="size-4" />
            Import
          </Button>

          <Button type="button" variant="outline" className="h-9 rounded-xl px-3">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={value => onTabChange(value as CatalogTabValue)} className="gap-0">
          <TabsList className="h-11 rounded-2xl px-1.5">
            <TabsTrigger value="processes" className="h-8 rounded-xl px-4">
              Processes
            </TabsTrigger>
            <TabsTrigger value="myTasks" className="h-8 rounded-xl px-4">
              My Tasks
            </TabsTrigger>
            <TabsTrigger value="submittedRequests" className="h-8 rounded-xl px-4">
              Submitted Requests
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-[340px]">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="h-11 rounded-2xl ps-9 pe-3" />
          </div>

          <Separator orientation="vertical" className="hidden h-8 sm:block" />

          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-xl border border-border">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default CatalogHeader
