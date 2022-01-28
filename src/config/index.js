export const apiToken = process.env.REACT_APP_GIT_API_TOKEN || process.env.REACT_APP_GIT_API_TOKEN_RESERVE;

export const grade = [
    { min: 0, max: 5, value: 1, },
    { min: 5, max: 10, value: 2, },
    { min: 10, max: 20, value: 3, },
    { min: 20, max: 30, value: 4, },
    { min: 30, max: 1000, value: 5, }
];

export const risks = [
    {
        title: '1 из 5 (консервативный)',
        value: 1,
    },
    {
        title: '2 из 5 (осторожный)',
        value: 2,
    },
    {
        title: '3 из 5 (взвешенный)',
        value: 3,
    },
    {
        title: '4 из 5 (прогрессивный)',
        value: 4,
    },
    {
        title: '5 из 5 (динамичный)',
        value: 5,
    },
];
