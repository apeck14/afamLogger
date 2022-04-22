module.exports = {
	formatTag: (tag) => {
		if (typeof tag !== "string") return

		return `#${tag
			.toUpperCase()
			.replace(/[^0-9a-z]/gi, "")
			.replace(/O/g, "0")
			.replace(/o/g, "0")}`
	},
	parseDate: (date) => {
		if (date instanceof Date) return date
		try {
			return new Date(
				Date.UTC(
					date.substr(0, 4),
					date.substr(4, 2) - 1,
					date.substr(6, 2),
					date.substr(9, 2),
					date.substr(11, 2),
					date.substr(13, 2)
				)
			)
		} catch (e) {
			console.log(`Error (parseDate): ${date}`)
		}
	},
	relativeDateStr: (date) => {
		const now = new Date()

		let diffMs = now.getTime() - date.getTime()

		let str = ""

		//check for days
		const diffDays = parseInt(diffMs / (1000 * 60 * 60 * 24))
		if (diffDays) {
			str += `${diffDays}d `
			diffMs -= diffDays * (1000 * 60 * 60 * 24)
		}

		//check for hours
		const diffHours = parseInt(diffMs / (1000 * 60 * 60))
		if (diffHours) {
			str += `${diffHours}h `
			diffMs -= diffHours * (1000 * 60 * 60)
		}

		//check for mins
		const diffMins = parseInt(diffMs / (1000 * 60))
		if (diffMins) {
			str += `${diffMins}m `
			diffMs -= diffMins * (1000 * 60)
		}

		//check for mins
		const diffSecs = parseInt(diffMs / 1000)
		if (diffSecs) {
			str += `${diffSecs}s `
			diffMs -= diffSecs * 1000
		}

		return str.trim() + " ago"
	},
	isWinner: (crowns, oppCrowns, matchCount) => {
		if (matchCount < 3) return crowns > oppCrowns
		else {
			//matchCount === 3
			if (crowns < 2) return false
			else if (oppCrowns < 2) return true
			else if (Math.abs(crowns - oppCrowns) <= 1) return "N/A"
			else if (crowns > oppCrowns) return true
			return false
		}
	},
}
