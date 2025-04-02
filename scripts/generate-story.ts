import fs from "fs"
import path from "path"

interface ComponentConfig {
  srcDir: string
  componentNames: string[]
}

// This script generates a Storybook story file for a given component.
// Usage: npm run generate-story <componentName>
// Example: npm run generate-story Button

// 実行時に指定したコンポーネントがcomponentNamesに含まれているかを確認し
// コンポーネントが見つればそのStoryファイルを生成する
const config: ComponentConfig = {
  srcDir: "./src",
  componentNames: [
    // Add your component directories here if necessary
   "components",
  ],
}

// Grab the component name from the command line arguments
const componentName = process.argv[2]
if (!componentName) {
  console.error("コンポーネント名を指定してください")
  process.exit(1)
}

function generateStoryTemplate(componentName: string, componentPath: string): string {
  return `import type { Meta, StoryObj } from "@storybook/react"
// This is useful if you want to spy on the certain action in the story such as onClick
import { fn } from '@storybook/test';

import { ${componentName} } from "./${componentName}"

const meta = {
    title: "${componentPath.replace(/^src\//, "")}",
    component: ${componentName},
    parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags:["autodocs"]
} satisfies Meta<typeof ${componentName}>

export default meta;
type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
    args: {
        // ここにpropsを追加してください
    }
}`
}

// Helper functions
// ディレクトリの中身を取得
function readDirSync(dirPath: string): string[] | null {
  try {
    return fs.readdirSync(dirPath)
  } catch {
    return null
  }
}

// ディレクトリの情報(メタデータ)を取得
function getStatSync(fullDirPath: string): fs.Stats | null {
  try {
    return fs.statSync(fullDirPath)
  } catch {
    return null
  }
}

// 大文字小文字を無視して文字列を比較
// 現状、ディレクトリ名は小文字スタート、ファイル名は大文字スタートのため
// 例: isCaseInsensitiveMatch("Foo", "foo") => true
function isCaseInsensitiveMatch(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

function isFileExist(dirPath: string, componentName:string): boolean{
    const componentPath = path.join(dirPath, `${componentName}.tsx`)
    return fs.existsSync(componentPath)
}

// ディレクトリ内を再帰的に探索
function searchDirectory(dirPath: string, componentName: string): string | null {
  const items = readDirSync(dirPath)
  
  if (!items) {
    console.error(`ディレクトリが見つかりません: ${dirPath}`)
    return null
  }

  for (const item of items) {
    const fullDirPath = path.join(dirPath, item)
    const stat = getStatSync(fullDirPath)

    const files = fs.readdirSync(fullDirPath)

    // Skip if the item is not a directory or the component file with .tsx does not exist
    // files.includes(`${componentName}.tsx`) is optional
    if (!stat || !files.includes(`${componentName}.tsx`)) continue

    if(stat.isDirectory()){
        if(isCaseInsensitiveMatch(item, componentName) && isFileExist(fullDirPath, componentName)){
            return fullDirPath
        }

        const result = searchDirectory(fullDirPath, componentName)
        if (result) return result
    }
  }

  return null
}

// コンポーネントを検索
function findComponent(componentName: string): string | null {
  for (const dir of config.componentNames) {
    const fullDirPath = path.join(config.srcDir, dir)
    if (!fs.existsSync(fullDirPath)) continue

    const result = searchDirectory(fullDirPath, componentName)
    if (result) return result
  }

  return null
}

// Storyファイルを生成
function generateStory() {
  try {
    const componentDir = findComponent(componentName)
    if (!componentDir) {
      console.error(`コンポーネント${componentName}がsrc配下に見つかりません`)
      process.exit(1)
    }

    const storyBookPath = path.join(componentDir, `${componentName}.stories.tsx`)

    // 既にstoryが存在している場合は処理を終了
    if (fs.existsSync(storyBookPath)) {
      console.error(`既にstoryが存在しています: ${storyBookPath}`)
      process.exit(1)
    }

    // storyファイルを生成
    const storyContent = generateStoryTemplate(componentName, componentDir)
    fs.writeFileSync(storyBookPath, storyContent)
    console.log(`Storyファイルを生成しました: ${storyBookPath}`)
  } catch (error) {
    console.error('エラーが発生しました:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

generateStory()
