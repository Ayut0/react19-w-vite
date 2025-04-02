import type { Meta, StoryObj } from "@storybook/react"

import { CancelButton } from "./CancelButton"

const meta = {
    title: "components/cancelButton",
    component: CancelButton,
    parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags:["autodocs"]
} satisfies Meta<typeof CancelButton>

export default meta;
type Story = StoryObj<typeof CancelButton>

export const Default: Story = {
    args: {
        // ここにpropsを追加してください
    }
}