import tinymce, { BodyComponentSpec } from "tinymce"

interface Emoticon {
  id: string
  name: string
  url: string
}

const icon = `<svg t="1701352119452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4290" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M511.488 118.670222a398.222222 398.222222 0 1 0 0 796.444445 398.222222 398.222222 0 0 0 0-796.444445z m0-85.333333a483.555556 483.555556 0 1 1 0 967.111111 483.555556 483.555556 0 0 1 0-967.111111zM292.067556 378.709333a69.063111 69.063111 0 1 1 138.126222 0 69.063111 69.063111 0 0 1-138.126222 0z m300.657777 0a69.063111 69.063111 0 1 1 138.183111 0 69.063111 69.063111 0 0 1-138.183111 0zM275.626667 545.336889h475.249777c0 108.828444-100.067556 239.502222-240.355555 239.502222-140.231111 0-234.894222-130.673778-234.894222-239.502222z" fill="#333333" p-id="4291"></path></svg>`

const tiebaEmoticons: Emoticon[] = [
  { name: "[真棒]", id: "tb-zb", url: "https://www.emojiall.com/images/60/baidu/1f44d.png" },
  { name: "[疑问]", id: "tb-yw", url: "https://www.emojiall.com/images/60/baidu/1f928.png" },
  { name: "[汗]", id: "tb-han", url: "https://www.emojiall.com/images/60/baidu/1f613.png" },
  { name: "[开心]", id: "tb-kx", url: "https://www.emojiall.com/images/60/baidu/263a.png" },
]

const biliEmoticons: Emoticon[] = [
  { name: "[哦呼]", id: "bl-oh", url: "https://www.emojiall.com/images/60/bilibili/default005.png" },
  { name: "[喜欢]", id: "bl-xh", url: "https://www.emojiall.com/images/60/bilibili/1f60d.png" },
  { name: "[大哭]", id: "bl-dk", url: "https://www.emojiall.com/images/60/bilibili/1f62d.png" },
  { name: "[大笑]", id: "bl-dx", url: "https://www.emojiall.com/images/60/bilibili/1f604.png" },
  { name: "[doge]", id: "bl-doge", url: "https://www.emojiall.com/images/60/bilibili/1f436.png" },
  { name: "[打call]", id: "bl-call", url: "https://www.emojiall.com/images/60/bilibili/1f64c.png" },
  { name: "[灵魂出窍]", id: "bl-cq", url: "https://www.emojiall.com/images/60/bilibili/1f47b.png" },
  { name: "[生气]", id: "bl-sq", url: "https://www.emojiall.com/images/60/bilibili/1f621.png" },
]

const douyinEmoticons: Emoticon[] = [
  { name: "[泣不成声]", id: "dy-qbcs", url: "https://www.emojiall.com/images/60/douyin/cnc.png" },
  { name: "[送心]", id: "dy-sx", url: "https://www.emojiall.com/images/60/douyin/1f970.png" },
  { name: "[快哭了]", id: "dy-kkl", url: "https://www.emojiall.com/images/60/douyin/1f625.png" },
  { name: "[流泪]", id: "dy-ll", url: "https://www.emojiall.com/images/60/douyin/1f622-new.png" },
]

const emoticonToMceComponent = (e: Emoticon): BodyComponentSpec => {
  return {
    type: "bar",
    items: [
      {
        type: "htmlpanel",
        html: `<div style="height: 40px; width: 40px"><img alt="${e.name}" src="${e.url}" style="height: 40px; width: 40px"/></div>`,
      },
      {
        type: "button",
        name: e.id,
        text: "添加",
      },
    ],
  }
}

tinymce.PluginManager.add("emoticons", function (editor) {
  const openDialog = () => {
    return editor.windowManager.open({
      title: "常用表情",
      body: {
        type: "panel",
        items: [
          {
            type: "label",
            label: "贴吧表情",
            items: [
              {
                type: "grid",
                columns: 4,
                items: [...tiebaEmoticons.map(emoticonToMceComponent)],
              },
            ],
          },
          {
            type: "label",
            label: "B站表情",
            items: [
              {
                type: "grid",
                columns: 4,
                items: [...biliEmoticons.map(emoticonToMceComponent)],
              },
            ],
          },
          {
            type: "label",
            label: "抖音表情",
            items: [
              {
                type: "grid",
                columns: 4,
                items: [...douyinEmoticons.map(emoticonToMceComponent)],
              },
            ],
          },
        ],
      },
      onAction(d, details) {
        let e: Emoticon
        switch (details.name.substring(0, 2)) {
          case "tb":
            e = tiebaEmoticons.find((e) => e.id === details.name) ?? tiebaEmoticons[0]
            break
          case "bl":
            e = biliEmoticons.find((e) => e.id === details.name) ?? biliEmoticons[0]
            break
          case "dy":
            e = douyinEmoticons.find((e) => e.id === details.name) ?? douyinEmoticons[0]
            break
          default:
            return
        }
        editor.insertContent(`<img alt="${e.name}" src="${e.url}" style="height: 80px; width: 80px"/>`)
        d.close()
      },
    })
  }

  editor.ui.registry.addIcon("emoticons", icon)

  editor.ui.registry.addButton("emoticons", {
    icon: "emoticons",
    tooltip: "常用表情",
    onAction: function () {
      openDialog()
    },
  })

  editor.ui.registry.addMenuItem("emoticons", {
    icon: "emoticons",
    text: "常用表情",
    onAction: function () {
      openDialog()
    },
  })

  return {
    getMetadata: function () {
      return {
        name: "Emoticons",
        url: "https://www.cinea.cc/",
      }
    },
  }
})
