import gql from 'graphql-tag';

export const ALL_CHANNELS_QUERY = gql`
    {
        channels {
            layers  {
                foreground {
                    name
                    path
                    length
                    loop
                    paused
                }
                background {
                    name
                    path
                    length
                    loop
                }
            }
        }
    }
`;

export const ALL_CHANNELS_SUBSCRIPTION = gql`
    subscription {
        playLayer {
            layers {
                foreground {
                    name
                    path
                    length
                    loop
                    paused
                }
                background {
                    name
                    path
                    length
                    loop
                }
            }
        }
    }
`;
