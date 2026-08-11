import { findByPropsLazy } from '@revenge-mod/modules/metro'

const GuildStore = findByPropsLazy('getGuild', 'getGuilds')
const SelectedGuildStore = findByPropsLazy('getGuildId')
const UserStore = findByPropsLazy('getUser', 'getCurrentUser')

function getOwner() {
	const guildId = SelectedGuildStore?.getGuildId?.()
	if (!guildId) return null

	const guild = GuildStore?.getGuild?.(guildId)
	if (!guild) return null

	const ownerId = guild.ownerId ?? guild.owner_id
	if (!ownerId) return null

	const user = UserStore?.getUser?.(ownerId)

	return {
		guildId,
		guildName: guild.name ?? 'Unknown server',
		ownerId: String(ownerId),
		username: user?.username ?? null,
		globalName: user?.globalName ?? user?.global_name ?? null,
	}
}

export default plugin({
	start() {
		;(globalThis as any).__revengeServerOwner = getOwner

		console.log('[Server Owner] started')
		console.log('[Server Owner] current owner:', getOwner())
	},

	stop() {
		delete (globalThis as any).__revengeServerOwner
		console.log('[Server Owner] stopped')
	},
})
