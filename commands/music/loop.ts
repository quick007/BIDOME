import { Command, CommandContext, Embed } from "harmony";
import { doPermCheck, queues } from "queue";
import { PlayerLoop } from "lavadeno";

export default class Loop extends Command {
	override name = "loop";
	override aliases = ["replay", "l"];
	override category = "music";
	override description = "Loop the current song";

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
			if (await doPermCheck(ctx.member!, botState.channel)) {
				const previousLoopType = queue.player.loop.toString();
				const isLoopDisabled = queue.player.loop != PlayerLoop.TRACK;

				if (isLoopDisabled) {
					queue.player.setLoop(PlayerLoop.TRACK);
				} else {
					queue.player.setLoop(PlayerLoop.OFF);
				}

				await ctx.message.reply({
					embeds: [
						new Embed({
							author: {
								name: "Bidome bot",
								icon_url: ctx.client.user!.avatarURL(),
							},
							title: "Toggled song loop",
							description: `Song looping is now ${
								previousLoopType == "track"
									? "Disabled"
									: "Enabled"
							} ${
								previousLoopType != "off" &&
									previousLoopType != "track"
									? `and queue looping is now disabled`
									: ""
							}`,
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
							title: "Unable to toggle loop",
							description:
								"You are missing the `ADMINISTRATOR` permission and you are not alone in the channel!",
						}).setColor("red"),
					],
				});
			}
		}
	}
}
