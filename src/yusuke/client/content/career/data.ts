import type { TimelineEntry } from "../../../../../@types/About"
import sierDetail from "./20070111-sier.md?raw"
import misocaDetail from "./20131201-misoca.md?raw"
import backlogDetail from "./20170601-backlog.md?raw"
import leanerDetail from "./20210118-leaner.md?raw"

export const careerEntries: TimelineEntry[] = [
	{
		date: "2021-01-18",
		endDate: "Now",
		title: "Leaner Technologies",
		image: "/yusuke/leaner.webp",
		detail: leanerDetail,
		color: "#436ABC",
	},
	{
		date: "2017-06-01",
		endDate: "2021-01-17",
		title: "Nulab - Backlog",
		image: "/yusuke/backlog.webp",
		detail: backlogDetail,
		color: "#1C8561",
	},
	{
		date: "2013-12-01",
		endDate: "2017-04-30",
		title: "Misoca（業務委託）",
		image: "/yusuke/misoca.webp",
		detail: misocaDetail,
		color: "#01ACC1",
	},
	{
		date: "2007-09-01",
		endDate: "2012-07-31",
		title: "SIer",
		detail: sierDetail,
		color: "#6f42c1",
	},
]

