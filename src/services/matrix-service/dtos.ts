export type LoginWithAccessTokenResponse = {
    userId: string;
    accessToken: string;
};

export enum Reactions {
    LIKE = 'like',
    SMILE = 'smile',
    ANGRY = 'angry',
}
