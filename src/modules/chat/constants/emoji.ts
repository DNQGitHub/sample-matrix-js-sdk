export const EMOJIS = [
    {
        key: ':beaming-face-with-smiling-eyes:',
        imageUrl: '/emoji/beaming-face-with-smiling-eyes.png',
    },
    {
        key: ':cold-face:',
        imageUrl: '/emoji/cold-face.png',
    },
    {
        key: ':expressionless:',
        imageUrl: '/emoji/expressionless.png',
    },
    {
        key: ':face-blowing-a-kiss:',
        imageUrl: '/emoji/face-blowing-a-kiss.png',
    },
    {
        key: ':face-exhaling:',
        imageUrl: '/emoji/face-exhaling.png',
    },
    {
        key: ':face-savoring-food:',
        imageUrl: '/emoji/face-savoring-food.png',
    },
    {
        key: ':face-with-raised-eyebrow:',
        imageUrl: '/emoji/face-with-raised-eyebrow.png',
    },
    {
        key: ':face-with-rolling-eyes:',
        imageUrl: '/emoji/face-with-rolling-eyes.png',
    },
    {
        key: ':face-with-tongue:',
        imageUrl: '/emoji/face-with-tongue.png',
    },
    {
        key: ':grimacing-face:',
        imageUrl: '/emoji/grimacing-face.png',
    },
    {
        key: ':grinning-face-with-big-eyes:',
        imageUrl: '/emoji/grinning-face-with-big-eyes.png',
    },
    {
        key: ':grinning-face-with-smiling-eyes:',
        imageUrl: '/emoji/grinning-face-with-smiling-eyes.png',
    },
    {
        key: ':grinning-face-with-sweat:',
        imageUrl: '/emoji/grinning-face-with-sweat.png',
    },
    {
        key: ':grinning-face:',
        imageUrl: '/emoji/grinning-face.png',
    },
    {
        key: ':grinning-squinting-face:',
        imageUrl: '/emoji/grinning-squinting-face.png',
    },
    {
        key: ':heart-eyes:',
        imageUrl: '/emoji/heart-eyes.png',
    },
    {
        key: ':kissing-face-with-smiling-eyes:',
        imageUrl: '/emoji/kissing-face-with-smiling-eyes.png',
    },
    {
        key: ':kissing-heart:',
        imageUrl: '/emoji/kissing-heart.png',
    },
    {
        key: ':laughing:',
        imageUrl: '/emoji/laughing.png',
    },
    {
        key: ':lying-face:',
        imageUrl: '/emoji/lying-face.png',
    },
    {
        key: ':neutral-face:',
        imageUrl: '/emoji/neutral-face.png',
    },
    {
        key: ':pensive:',
        imageUrl: '/emoji/pensive.png',
    },
    {
        key: ':relieved:',
        imageUrl: '/emoji/relieved.png',
    },
    {
        key: ':shushing-face:',
        imageUrl: '/emoji/shushing-face.png',
    },
    {
        key: ':smiling-face-with-halo:',
        imageUrl: '/emoji/smiling-face-with-halo.png',
    },
    {
        key: ':smiling-face-with-heart-eyes:',
        imageUrl: '/emoji/smiling-face-with-heart-eyes.png',
    },
    {
        key: ':smiling-face-with-hearts:',
        imageUrl: '/emoji/smiling-face-with-hearts.png',
    },
    {
        key: ':smiling-face-with-smiling-eyes:',
        imageUrl: '/emoji/smiling-face-with-smiling-eyes.png',
    },
    {
        key: ':smiling-face-with-tear:',
        imageUrl: '/emoji/smiling-face-with-tear.png',
    },
    {
        key: ':star-struck:',
        imageUrl: '/emoji/star-struck-smile.png',
    },
    {
        key: ':sweat-smile:',
        imageUrl: '/emoji/sweat-smile.png',
    },
    {
        key: ':winking-face-with-tongue:',
        imageUrl: '/emoji/winking-face-with-tongue.png',
    },
    {
        key: ':winking-face:',
        imageUrl: '/emoji/winking-face.png',
    },
    {
        key: ':wonder-face:',
        imageUrl: '/emoji/wonder-face.png',
    },
    {
        key: ':zany-face:',
        imageUrl: '/emoji/zany-face.png',
    },
    {
        key: ':zipper-mouth-face:',
        imageUrl: '/emoji/zipper-mouth-face.png',
    },
];

export const EMOJIS_MAP = EMOJIS.reduce((p, c) => {
    p[c.key] = c;
    return p;
}, {} as { [key: string]: { key: string; imageUrl: string } });

export const EMOJIS_USED_FOR_REACTIONS = [
    EMOJIS_MAP[':grinning-face:'],
    EMOJIS_MAP[':face-blowing-a-kiss:'],
    EMOJIS_MAP[':grinning-squinting-face:'],
    EMOJIS_MAP[':smiling-face-with-heart-eyes:'],
    EMOJIS_MAP[':grinning-face-with-sweat:'],
    EMOJIS_MAP[':cold-face:'],
];
