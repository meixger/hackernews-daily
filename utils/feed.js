import * as core from '@actions/core';
import * as fs from 'fs';
import { Feed } from "feed";
import { getIssues } from "../utils/issue.js";
import showdown from 'showdown'

export const updateFeed = async () => {
  const issues = await getIssues({
    owner: 'meixger',
    repo: 'hackernews-daily',
    take: 30
  });

  const feed = new Feed({
    title: `Hacker News Daily Top 30`,
    description: "Hacker News Daily Top 30",
    // id: "http://example.com/",
    link: "https://github.com/meixger/hackernews-daily/issues/",
    // language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    // image: "http://example.com/image.png",
    // favicon: "http://example.com/favicon.ico",
    // copyright: "All rights reserved 2013, John Doe",
    // updated: new Date(2013, 6, 14), // optional, default = today
    // generator: "awesome", // optional, default = 'Feed for Node.js'
    // feedLinks: {
    //   json: "https://example.com/json",
    //   atom: "https://example.com/atom"
    // },
    // author: {
    //   name: "John Doe",
    //   email: "johndoe@example.com",
    //   link: "https://example.com/johndoe"
    // }
  });

  const converter = new showdown.Converter();
  issues.forEach(i => {
    feed.addItem({
      title: i.title,
      id: i.number.toString(),
      link: i.html_url,
      // description: post.description,
      content: converter.makeHtml(i.body),
      // author: [
      //   {
      //     name: "Jane Doe",
      //     email: "janedoe@example.com",
      //     link: "https://example.com/janedoe"
      //   }
      // ],
      // contributor: [
      //   {
      //     name: "Shawn Kemp",
      //     email: "shawnkemp@example.com",
      //     link: "https://example.com/shawnkemp"
      //   }
      // ],
      date: new Date(i.updated_at),
      // image: post.image
    });
  });

  fs.writeFile('rss2.xml', feed.rss2(), cb => { if (cb) core.error(cb); })
}
