export type SlackTextObject = {
    type: "plain_text" | "mrkdwn";
    text: string;
    emoji?: boolean;
};

export type SlackBlock = {
    type: string;
    block_id?: string;
};

export type HeaderBlock = SlackBlock & {
    type: "header";
    text: {
        type: "plain_text";
        text: string;
        emoji?: boolean;
    };
};

export type DividerBlock = SlackBlock & {
    type: "divider";
};

export type SectionBlock = SlackBlock & {
    type: "section";
    text?: SlackTextObject;
    accessory?: any;
    fields?: SlackTextObject[];
};

export type ContextBlock = SlackBlock & {
    type: "context";
    elements: (SlackTextObject | {
        type: "image";
        image_url: string;
        alt_text: string;
    })[];
};

export type SlackMessage = {
    blocks: (HeaderBlock | DividerBlock | SectionBlock | ContextBlock)[];
    text?: string | null;
};
