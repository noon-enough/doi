Component({
    properties: {
        emoji: {
            type: Object,
            value: {},
        }
    },
    data: {
        Data: {},
    },
    methods: {
        onEmoji(e) {
            console.log('onEmoji', e)
            this.triggerEvent('mantap',  e.currentTarget.dataset);
        },
    },
    attached() {
        let that = this,
            properties = that.properties,
            Data = {}

        Data = properties.emoji
        Data.emoticons = {}
        Data.natives = {}

        console.log('properties', properties)

        Data.categories.unshift({
            id: 'frequent',
            emojis: [],
        })

        for (const alias in Data.aliases) {
            const emojiId = Data.aliases[alias]
            const emoji = Data.emojis[emojiId]
            if (!emoji) continue

            emoji.aliases || (emoji.aliases = [])
            emoji.aliases.push(alias)
        }

        Data.originalCategories = Data.categories

        Data.categories = Data.categories.filter((c) => {
            const isCustom = !!c.name
            return !isCustom
        })

        let categoryIndex = Data.categories.length
        let resetSearchIndex = false
        while (categoryIndex--) {
            const category = Data.categories[categoryIndex]

            if (category.id === 'frequent') {
                // let {maxFrequentRows, perLine} = props

                // maxFrequentRows =
                //     maxFrequentRows >= 0
                //         ? maxFrequentRows
                //         : PickerProps.maxFrequentRows.value
                // perLine || (perLine = PickerProps.perLine.value)
                //
                // category.emojis = FrequentlyUsed.get({ maxFrequentRows, perLine })
            }

            if (!category.emojis || !category.emojis.length) {
                Data.categories.splice(categoryIndex, 1)
                continue
            }

            // const {categoryIcons} = props
            // if (categoryIcons) {
            //     const icon = categoryIcons[category.id]
            //     if (icon && !category.icon) {
            //         category.icon = icon
            //     }
            // }
            let emojiIndex = category.emojis.length
            while (emojiIndex--) {
                const emojiId = category.emojis[emojiIndex]
                const emoji = emojiId.id ? emojiId : Data.emojis[emojiId]

                const ignore = () => {
                    category.emojis.splice(emojiIndex, 1)
                }


                if (!emoji.search) {
                    resetSearchIndex = true
                    emoji.search =
                        ',' +
                        [
                            [emoji.id, false],
                            [emoji.name, true],
                            [emoji.keywords, false],
                            [emoji.emoticons, false],
                        ]
                            .map(([strings, split]) => {
                                if (!strings) return
                                return (Array.isArray(strings) ? strings : [strings])
                                    .map((string) => {
                                        return (split ? string.split(/[-|_|\s]+/) : [string]).map(
                                            (s) => s.toLowerCase(),
                                        )
                                    })
                                    .flat()
                            })
                            .flat()
                            .filter((a) => a && a.trim())
                            .join(',')

                    if (emoji.emoticons) {
                        for (const emoticon of emoji.emoticons) {
                            if (Data.emoticons[emoticon]) continue
                            Data.emoticons[emoticon] = emoji.id
                        }
                    }
                    let skinIndex = 0
                    for (const skin of emoji.skins) {
                        if (!skin) continue
                        skinIndex++

                        const { native } = skin
                        if (native) {
                            Data.natives[native] = emoji.id
                            emoji.search += `,${native}`
                        }

                        const skinShortcodes =
                            skinIndex === 1 ? '' : `:skin-tone-${skinIndex}:`
                        skin.shortcodes = `:${emoji.id}:${skinShortcodes}`
                    }
                }
            }
        }

        // 开始算行了
        Data.categories.forEach((category) => {
            let emojis = category.emojis ?? []
            if (emojis.length <= 0) {
                return
            }

            category.newEmojis = []
            let count = emojis.length,
                row = Math.ceil(count / 9)
            for (let i = 0; i < row; i ++) {
                let start = i === 0 ? 0 : i * 9,
                    end = (i + 1) * 9
                category.newEmojis[i] = emojis.slice(start, end)
            }
        })

        that.setData({
            Data: Data,
        })
    }
});
