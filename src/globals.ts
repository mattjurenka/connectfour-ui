export const sui_devnet_package = "0x70eece37b429e7b8f4c48ed3ce09305d0a3f3df06cdf3fe306cc9b989c746ec3"

export const challenge_func: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::challenge`
export const revoke_challenge_func: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::revoke_challenge`
export const accept_challenge_func: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::accept_challenge`
export const make_move_yellow_func: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::make_move_yellow`
export const make_move_red_func: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::make_move_red`

export const yellow_participant_type: `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::YellowParticipation`
export const red_participant_type:    `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::RedParticipation`

export const revoke_challenge_cap:    `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::RevokeChallengeCap`
export const accept_challenge_cap:    `${string}::${string}::${string}` = `${sui_devnet_package}::connect_four::AcceptChallengeCap`
