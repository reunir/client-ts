export type SignupObject = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    seed: string;
    stripe: string;
    backgroundColor: string
};
export type ModifiedSignupObject = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    seed?: string;
    stripe?: string;
    backgroundColor?: string
}