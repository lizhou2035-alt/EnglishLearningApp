import { Category } from './types';

export const MOCK_DATA: Category[] = [
  {
    id: 'cat_env',
    name: 'Environment',
    subcategories: [
      {
        id: 'sub_nature',
        name: 'Nature & Ecosystems',
        groups: [
          {
            id: 'grp_nature_1',
            name: 'Group 1',
            words: [
              {
                id: 'w1',
                word: 'environment',
                syllables: ['en', 'vi', 'ron', 'ment'],
                stressedSyllableIndex: 1,
                phonetic: "/ɪnˈvaɪrənmənt/",
                pos: "n.",
                definitionEN: "The surroundings or conditions in which a person, animal, or plant lives or operates.",
                definitionCN: "环境",
                synonyms: ["surroundings", "habitat", "territory"],
                antonyms: [],
                sentenceEN: "We must protect the environment for future generations.",
                sentenceCN: "我们必须为子孙后代保护环境。",
                forms: [
                    { pos: "adj.", word: "environmental" },
                    { pos: "adv.", word: "environmentally" }
                ]
              },
              {
                id: 'w2',
                word: 'ecosystem',
                syllables: ['ec', 'o', 'sys', 'tem'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈiːkəʊsɪstəm/",
                pos: "n.",
                definitionEN: "A biological community of interacting organisms and their physical environment.",
                definitionCN: "生态系统",
                synonyms: ["ecology", "bionetwork"],
                antonyms: [],
                sentenceEN: "The rainforest is a complex and fragile ecosystem.",
                sentenceCN: "雨林是一个复杂而脆弱的生态系统。",
                forms: [
                    { pos: "adj.", word: "ecological" }
                ]
              },
              {
                id: 'w3',
                word: 'biodiversity',
                syllables: ['bi', 'o', 'di', 'ver', 'si', 'ty'],
                stressedSyllableIndex: 3,
                phonetic: "/ˌbaɪəʊdaɪˈvɜːsəti/",
                pos: "n.",
                definitionEN: "The variety of life in the world or in a particular habitat or ecosystem.",
                definitionCN: "生物多样性",
                synonyms: ["biological variety"],
                antonyms: ["monoculture"],
                sentenceEN: "Biodiversity is essential for a healthy planet.",
                sentenceCN: "生物多样性对于一个健康的地球至关重要。",
                forms: [
                    { pos: "adj.", word: "biodiverse" }
                ]
              },
              {
                id: 'w4',
                word: 'habitat',
                syllables: ['ha', 'bi', 'tat'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈhæbɪtæt/",
                pos: "n.",
                definitionEN: "The natural home or environment of an animal, plant, or other organism.",
                definitionCN: "栖息地",
                synonyms: ["home", "domain", "environment"],
                antonyms: [],
                sentenceEN: "Deforestation destroys the natural habitat of many species.",
                sentenceCN: "森林砍伐破坏了许多物种的自然栖息地。",
                forms: [
                    { pos: "n.", word: "habitation" }
                ]
              },
              {
                id: 'w5',
                word: 'conservation',
                syllables: ['con', 'ser', 'va', 'tion'],
                stressedSyllableIndex: 2,
                phonetic: "/ˌkɒnsəˈveɪʃn/",
                pos: "n.",
                definitionEN: "Preservation, protection, or restoration of the natural environment.",
                definitionCN: "保护；保存",
                synonyms: ["preservation", "protection"],
                antonyms: ["destruction", "neglect"],
                sentenceEN: "Wildlife conservation is a major concern today.",
                sentenceCN: "野生动物保护是今天的一个主要关注点。",
                forms: [
                    { pos: "v.", word: "conserve" },
                    { pos: "adj.", word: "conservative" }
                ]
              },
              {
                id: 'w6',
                word: 'pollution',
                syllables: ['pol', 'lu', 'tion'],
                stressedSyllableIndex: 1,
                phonetic: "/pəˈluːʃn/",
                pos: "n.",
                definitionEN: "The presence in or introduction into the environment of a substance which has harmful or poisonous effects.",
                definitionCN: "污染",
                synonyms: ["contamination", "impurity"],
                antonyms: ["purification", "cleanliness"],
                sentenceEN: "Air pollution is a serious health hazard in big cities.",
                sentenceCN: "空气污染是大城市严重的健康隐患。",
                forms: [
                    { pos: "v.", word: "pollute" },
                    { pos: "adj.", word: "polluted" }
                ]
              },
              {
                id: 'w7',
                word: 'climate',
                syllables: ['cli', 'mate'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈklaɪmət/",
                pos: "n.",
                definitionEN: "The weather conditions prevailing in an area in general or over a long period.",
                definitionCN: "气候",
                synonyms: ["weather pattern", "atmosphere"],
                antonyms: [],
                sentenceEN: "Climate change affects weather patterns globally.",
                sentenceCN: "气候变化影响着全球的天气模式。",
                forms: [
                    { pos: "adj.", word: "climatic" }
                ]
              },
              {
                id: 'w8',
                word: 'atmosphere',
                syllables: ['at', 'mos', 'phere'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈætməsfɪə(r)/",
                pos: "n.",
                definitionEN: "The envelope of gases surrounding the earth or another planet.",
                definitionCN: "大气层；气氛",
                synonyms: ["air", "sky", "aerosphere"],
                antonyms: [],
                sentenceEN: "The earth's atmosphere protects us from harmful radiation.",
                sentenceCN: "地球的大气层保护我们免受有害辐射。",
                forms: [
                    { pos: "adj.", word: "atmospheric" }
                ]
              },
              {
                id: 'w9',
                word: 'sustainability',
                syllables: ['sus', 'tain', 'a', 'bil', 'i', 'ty'],
                stressedSyllableIndex: 3,
                phonetic: "/səˌsteɪnəˈbɪləti/",
                pos: "n.",
                definitionEN: "The ability to be maintained at a certain rate or level.",
                definitionCN: "可持续性",
                synonyms: ["durability", "viability"],
                antonyms: ["instability"],
                sentenceEN: "Environmental sustainability ensures resources for the future.",
                sentenceCN: "环境可持续性确保了未来的资源。",
                forms: [
                    { pos: "v.", word: "sustain" },
                    { pos: "adj.", word: "sustainable" }
                ]
              },
              {
                id: 'w10',
                word: 'renewable',
                syllables: ['re', 'new', 'a', 'ble'],
                stressedSyllableIndex: 1,
                phonetic: "/rɪˈnjuːəbl/",
                pos: "adj.",
                definitionEN: "Capable of being renewed; (of energy) not depleted when used.",
                definitionCN: "可再生的",
                synonyms: ["sustainable", "inexhaustible"],
                antonyms: ["non-renewable", "finite"],
                sentenceEN: "Solar and wind power are renewable energy sources.",
                sentenceCN: "太阳能和风能是可再生能源。",
                forms: [
                    { pos: "v.", word: "renew" },
                    { pos: "n.", word: "renewal" }
                ]
              }
            ]
          },
          {
            id: 'grp_nature_2',
            name: 'Group 2',
            words: [
              {
                 id: 'w11',
                 word: 'deforestation',
                 syllables: ['de', 'for', 'es', 'ta', 'tion'],
                 stressedSyllableIndex: 3,
                 phonetic: "/ˌdiːˌfɒrɪˈsteɪʃn/",
                 pos: "n.",
                 definitionEN: "The action of clearing a wide area of trees.",
                 definitionCN: "滥伐森林",
                 synonyms: ["logging", "clear-cutting"],
                 antonyms: ["reforestation"],
                 sentenceEN: "Deforestation contributes significantly to global warming.",
                 sentenceCN: "滥伐森林极大地导致了全球变暖。",
                 forms: [
                     { pos: "v.", word: "deforest" }
                 ]
              },
              {
                id: 'w12',
                word: 'significant',
                syllables: ['sig', 'nif', 'i', 'cant'],
                stressedSyllableIndex: 1,
                phonetic: "/sɪɡˈnɪfɪkənt/",
                pos: "adj.",
                definitionEN: "Sufficiently great or important to be worthy of attention; noteworthy.",
                definitionCN: "显著的；重要的",
                synonyms: ["notable", "remarkable", "important"],
                antonyms: ["insignificant", "minor"],
                sentenceEN: "There has been a significant increase in the use of solar energy.",
                sentenceCN: "太阳能的使用有了显著的增加。",
                forms: [
                    { pos: "n.", word: "significance" },
                    { pos: "adv.", word: "significantly" }
                ]
              },
              {
                id: 'w13',
                word: 'contribute',
                syllables: ['con', 'trib', 'ute'],
                stressedSyllableIndex: 1,
                phonetic: "/kənˈtrɪbjuːt/",
                pos: "v.",
                definitionEN: "To give (something, especially money) in order to help achieve or provide something.",
                definitionCN: "贡献；出力",
                synonyms: ["donate", "supply", "provide"],
                antonyms: ["withhold"],
                sentenceEN: "Everyone should contribute to saving our planet.",
                sentenceCN: "每个人都应该为拯救我们的地球做出贡献。",
                forms: [
                    { pos: "n.", word: "contribution" },
                    { pos: "n.", word: "contributor" }
                ]
              },
              {
                id: 'w14',
                word: 'enhance',
                syllables: ['en', 'hance'],
                stressedSyllableIndex: 1,
                phonetic: "/ɪnˈhɑːns/",
                pos: "v.",
                definitionEN: "To intensify, increase, or further improve the quality, value, or extent of.",
                definitionCN: "提高；增强",
                synonyms: ["improve", "boost", "augment"],
                antonyms: ["diminish", "reduce"],
                sentenceEN: "Planting trees can enhance the local environment.",
                sentenceCN: "植树可以改善当地环境。",
                forms: [
                    { pos: "n.", word: "enhancement" }
                ]
              },
              {
                id: 'w15',
                word: 'impact',
                syllables: ['im', 'pact'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈɪmpækt/",
                pos: "n.",
                definitionEN: "A marked effect or influence.",
                definitionCN: "影响；冲击",
                synonyms: ["effect", "influence", "consequence"],
                antonyms: [],
                sentenceEN: "Pollution has a negative impact on wildlife.",
                sentenceCN: "污染对野生动物有负面影响。",
                forms: [
                    { pos: "v.", word: "impact" }
                ]
              },
              {
                id: 'w16',
                word: 'efficient',
                syllables: ['ef', 'fi', 'cient'],
                stressedSyllableIndex: 1,
                phonetic: "/ɪˈfɪʃnt/",
                pos: "adj.",
                definitionEN: "Achieving maximum productivity with minimum wasted effort or expense.",
                definitionCN: "高效的",
                synonyms: ["effective", "productive", "organized"],
                antonyms: ["inefficient", "wasteful"],
                sentenceEN: "LED lights are more efficient than traditional bulbs.",
                sentenceCN: "LED灯比传统灯泡更高效。",
                forms: [
                    { pos: "n.", word: "efficiency" },
                    { pos: "adv.", word: "efficiently" }
                ]
              },
              {
                id: 'w17',
                word: 'essential',
                syllables: ['es', 'sen', 'tial'],
                stressedSyllableIndex: 1,
                phonetic: "/ɪˈsenʃl/",
                pos: "adj.",
                definitionEN: "Absolutely necessary; extremely important.",
                definitionCN: "必不可少的；基本的",
                synonyms: ["crucial", "vital", "necessary"],
                antonyms: ["nonessential", "optional"],
                sentenceEN: "Clean water is essential for all living things.",
                sentenceCN: "清洁的水对所有生物都是必不可少的。",
                forms: [
                    { pos: "adv.", word: "essentially" },
                    { pos: "n.", word: "essence" }
                ]
              },
              {
                id: 'w18',
                word: 'access',
                syllables: ['ac', 'cess'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈækses/",
                pos: "n.",
                definitionEN: "The means or opportunity to approach or enter a place.",
                definitionCN: "入口；使用权",
                synonyms: ["entry", "admission", "entrance"],
                antonyms: ["exit"],
                sentenceEN: "Everyone should have access to clean energy.",
                sentenceCN: "每个人都应该有机会获得清洁能源。",
                forms: [
                    { pos: "adj.", word: "accessible" },
                    { pos: "n.", word: "accessibility" }
                ]
              },
              {
                id: 'w19',
                word: 'sustainable',
                syllables: ['sus', 'tain', 'a', 'ble'],
                stressedSyllableIndex: 1,
                phonetic: "/səˈsteɪnəbl/",
                pos: "adj.",
                definitionEN: "Able to be maintained at a certain rate or level.",
                definitionCN: "可持续的",
                synonyms: ["viable", "feasible", "continuous"],
                antonyms: ["unsustainable"],
                sentenceEN: "We need to find sustainable solutions for waste management.",
                sentenceCN: "我们需要为废物管理找到可持续的解决方案。",
                forms: [
                    { pos: "n.", word: "sustainability" },
                    { pos: "v.", word: "sustain" }
                ]
              },
              {
                id: 'w20',
                word: 'opportunity',
                syllables: ['op', 'por', 'tu', 'ni', 'ty'],
                stressedSyllableIndex: 2,
                phonetic: "/ˌɒpəˈtjuːnəti/",
                pos: "n.",
                definitionEN: "A set of circumstances that makes it possible to do something.",
                definitionCN: "机会；时机",
                synonyms: ["chance", "occasion", "opening"],
                antonyms: [],
                sentenceEN: "This project is a great opportunity to learn about nature.",
                sentenceCN: "这个项目是一个了解大自然的绝佳机会。",
                forms: [
                    { pos: "adj.", word: "opportune" }
                ]
              },
              {
                id: 'w22',
                word: 'trend',
                syllables: ['trend'],
                stressedSyllableIndex: 0,
                phonetic: "/trend/",
                pos: "n.",
                definitionEN: "A general direction in which something is developing or changing.",
                definitionCN: "趋势；动向",
                synonyms: ["tendency", "movement", "drift"],
                antonyms: [],
                sentenceEN: "There is a growing trend towards using electric cars.",
                sentenceCN: "使用电动汽车的趋势日益增长。",
                forms: [
                    { pos: "adj.", word: "trendy" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sub_resources',
        name: 'Resources & Minerals',
        groups: [
           {
            id: 'grp_res_1',
            name: 'Group 1',
            words: [
               {
                id: 'w21',
                word: 'mineral',
                syllables: ['min', 'er', 'al'],
                stressedSyllableIndex: 0,
                phonetic: "/ˈmɪnərəl/",
                pos: "n.",
                definitionEN: "A solid inorganic substance of natural occurrence.",
                definitionCN: "矿物",
                synonyms: [],
                antonyms: [],
                sentenceEN: "This region is rich in valuable minerals.",
                sentenceCN: "这个地区富含珍贵的矿产。",
                forms: [
                    { pos: "v.", word: "mineralize" },
                    { pos: "adj.", word: "mineral" }
                ]
              }
            ]
           }
        ]
      }
    ]
  }
];