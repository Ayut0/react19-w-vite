
    import type { Meta, StoryObj } from "@storybook/react"


    import { Comments } from "./Comments"

    const meta = {
        title: "components/comments",
        component: Comments,
        parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
        },
        // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
        tags:["autodocs"],
    } satisfies Meta<typeof Comments>

    export default meta;
    type Story = StoryObj<typeof Comments>

    export const Default: Story = {
        args: {
            // ここにpropsを追加してください
        }
    }
  