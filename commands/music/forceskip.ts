import { Command, CommandContext, Embed } from "harmony";
import { doPermCheck, queues } from "queue";
import { PlayerLoop } from "lavadeno";

export default class ForceSkip extends Command {
	override name = "forceskip";
	override aliases = ["fs"];
	override category = "music";
	override description = "Skip the current song without a vote";

	override async execute(ctx: CommandContext) {
		if (ctx.guild == undefined) return;
		const botState = await ctx.guild!.voiceStates.get(ctx.client.user!.id);
		if (
			queues.has(ctx.guild!.id) &&
			(botState == undefined || botState.channel == undefined)
		) {
			queues.get(ctx.guild!.id)!.deleteQueue();
		}

		const queue = queues.get(ctx.guild.id);
		if (
			queue == undefined ||
			botState == undefined ||
			botState.channel == undefined
		) {
			await ctx.message.reply(undefined, {
				embeds: [
					new Embed({
						author: {
							name: "Bidome bot",
							icon_url: ctx.client.user!.avatarURL(),
						},
						title: "Not currently playing!",
						description: "I am not currently playing anything!",
					}).setColor("red"),
				],
			});

			if (queue != undefined) {
				queue.deleteQueue();
			}
		} else {
			const queue = queues.get(ctx.guild!.id)!;
			if (
				(await doPermCheck(ctx.member!, botState.channel!)) ||
				(queue.player.current!.requestedBy as unknown as string) ==
					ctx.author.id
			) {
				if (queue.player.queue.size == 0) {
					queue.deleteQueue();
				} else {
					const currentLoopState = queue.player.loop;
					queue.player.setLoop(PlayerLoop.OFF);
					await queue.player.skip();
					queue.player.setLoop(currentLoopState);
				}

				await ctx.message.reply({
					embeds: [
						new Embed({
							author: {
								name: "Bidome bot",
								icon_url: ctx.client.user!.avatarURL(),
							},
							title: "Skipped",
							description: "I have skipped the current song",
						}).setColor("green"),
					],
				});
			} else {
				await ctx.message.reply({
					embeds: [
						new Embed({
							author: {
								name: "Bidome bot",
								icon_url: ctx.client.user!.avatarURL(),
							},
							title: "Unable to skip",
							description:
								"You are not an `ADMINISTRATOR`, Alone in the channel, or the song requester",
						}).setColor("red"),
					],
				});
			}
		}
	}
}
