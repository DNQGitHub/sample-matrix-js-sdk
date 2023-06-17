export type LoginWithAccessTokenResponse = {
    userId: string;
    accessToken: string;
};

export enum EReaction {
    LIKE = 'like',
    SMILE = 'smile',
    ANGRY = 'angry',
}
