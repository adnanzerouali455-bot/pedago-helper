export interface EnglishModel {
  title: string;
  competency: string;
  situations: [string, string, string, string];
  evidence: string;
  texts: [string, string, string];
  glossary: { term: string; definition: string }[];
  questions: [string, string, string];
  obstacle: string;
  remediation: string;
}
export const englishModels: Record<'svt' | 'math' | 'arabic' | 'french', EnglishModel> = {
  svt: {
    title: 'Photosynthesis: how plants make food',
    competency: 'Explain, using experimental evidence, how light supports the production of organic matter in green plants.',
    situations: [
      'Compare two similar leaves on the same plant: one received light and the other was covered. Predict which leaf will contain starch and explain why.',
      'In groups, draw and label the plant’s possible needs. Distinguish observations from hypotheses.',
      'Examine the supplied results table: after a period in darkness and controlled exposure to light, only the lit area turns blue-black in an iodine test. Discuss controlled variables and limits of this evidence.',
      'Write the class summary: in light, green plant organs use water and carbon dioxide to make organic matter and release oxygen. Plants also respire.',
    ],
    evidence: 'A diagram showing inputs and outputs, with an explanation supported by the experimental results.',
    texts: [
      'A green plant needs water. It also receives sunlight. Its leaves take carbon dioxide from the air. With light, they make sugars. They release oxygen. This process is called photosynthesis. Roots absorb water and minerals from the soil. The plant also respires during the day and at night.',
      'Roots absorb water and minerals, while leaves take carbon dioxide from the air. Using light energy, green plant parts make sugars; this process is photosynthesis. Oxygen is released. Some sugar can be stored as starch. Therefore, an iodine test can reveal this store. However, the absence of starch alone cannot explain every possible cause. The plant also respires during both day and night.',
      'Photosynthesis converts light energy into chemical energy in chlorophyll-containing tissues. In chloroplasts, water and carbon dioxide are used to synthesize organic matter while oxygen is released. Minerals are essential to plant function and growth, but they are not the source of its organic carbon. Some photosynthetic products may accumulate as starch. Detection with iodine is therefore indirect evidence whose interpretation requires controls and controlled variables. Photosynthesis and respiration occur together; their gas exchanges must be distinguished.',
    ],
    glossary: [
      { term: 'photosynthesis', definition: 'The use of light energy to make organic matter from water and carbon dioxide.' },
      { term: 'starch', definition: 'A storage carbohydrate made of many glucose units.' },
      { term: 'chloroplasts', definition: 'Structures in plant cells that contain chlorophyll and carry out photosynthesis.' },
    ],
    questions: [
      'Which substances does the plant use to make sugars?',
      'Why compare a lit area with a covered area of the same plant?',
      'A student says plants respire only at night. How does the text help you respond?',
    ],
    obstacle: 'Confusing minerals absorbed from soil with the organic matter that the plant produces.',
    remediation: 'Sort cards into “taken from the environment” and “made by the plant,” then rebuild the exchange diagram.',
  },
  math: {
    title: 'Comparing fractions',
    competency: 'Compare two positive fractions and justify the comparison with a representation or a common denominator.',
    situations: [
      'Two students share equal-sized flatbreads: one gets 3/4 and the other 2/3. Who gets more? Explore without being given a rule.',
      'In pairs, draw the portions and explain the strategy to another group. Check that the whole units are equal in size.',
      'Compare the diagrams: 3/4 = 9/12 and 2/3 = 8/12. Test the incorrect claim that a larger denominator always makes a larger fraction.',
      'Formalize the rule: when positive denominators are equal, compare numerators. Multiplying numerator and denominator by the same nonzero number preserves the fraction’s value.',
    ],
    evidence: 'A justified comparison of 3/4 and 2/3 followed by a correct application to 5/6 and 3/4.',
    texts: [
      'A fraction represents part of a whole. The denominator tells how many equal parts the whole has. The numerator tells how many parts are taken. Use the same-sized whole to compare parts. Three quarters equal nine twelfths. Two thirds equal eight twelfths. Therefore, three quarters are greater than two thirds.',
      'To compare two fractions, first use the same-sized whole. If their denominators differ, find equivalent fractions. For example, multiply both numbers in 3/4 by 3 to get 9/12. Multiply both numbers in 2/3 by 4 to get 8/12. The parts are now equal in size, so compare the numerators. Because 9 is greater than 8, 3/4 > 2/3.',
      'Comparing positive fractions depends on preserving their values when rewriting them in equivalent forms. Multiplying the numerator and denominator by the same nonzero number leaves the quotient unchanged. A common denominator then expresses the quantities in equal-sized parts: 3/4 = 9/12 and 2/3 = 8/12, so 3/4 > 2/3. A least common multiple can keep the numbers smaller, but any common multiple works. A number line provides another check.',
    ],
    glossary: [
      { term: 'denominator', definition: 'The number below the fraction bar; it indicates how many equal parts make the whole.' },
      { term: 'numerator', definition: 'The number above the fraction bar; it indicates how many parts are taken.' },
      { term: 'equivalent fractions', definition: 'Fractions written differently that represent the same number.' },
    ],
    questions: [
      'Why must the whole units be the same size?',
      'How can you prove that 3/4 is greater than 2/3?',
      'Does a larger denominator always mean a larger fraction? Give a counterexample.',
    ],
    obstacle: 'Comparing denominators as whole numbers without considering the size of each part.',
    remediation: 'Place equal-length strips divided into halves and quarters side by side; discuss number of parts versus size of parts.',
  },
  arabic: {
    title: 'Reading an informational text about saving water',
    competency: 'Identify the main idea, distinguish facts from recommendations, and justify a proposal with evidence from the text.',
    situations: [
      'Show two possible titles for a text about water. Read individually and choose the title that best expresses its main idea.',
      'Compare chosen titles in groups and highlight words that state a fact or give advice.',
      'Debate the choices by quoting a specific sentence. Check that each proposal really follows from the information given.',
      'Establish a method: identify the topic, connect the facts, state the main idea, and support an interpretation with textual evidence.',
    ],
    evidence: 'A suitable title, an identified fact, and a recommendation supported by the text.',
    texts: [
      'Water is necessary for life. We use water for drinking and washing. A leaking tap wastes water. Tell an adult about the leak. Turning off the tap while brushing your teeth reduces waste. Everyone can help at home and at school.',
      'Water is essential for life and hygiene. Yet some habits waste water unnecessarily. For example, a leaking tap lets water escape without useful purpose. The leak should therefore be reported and repaired. Turning off the tap while brushing your teeth also reduces waste. These actions do not replace shared management of water resources, but they contribute to it.',
      'Protecting water resources combines individual behavior with collective management of supply networks. A leak is a measurable loss; recommending its repair is an action based on that observation. Readers of informational texts must distinguish verifiable facts from recommendations. Reducing household waste is useful, but evaluating a water policy also requires data about uses, infrastructure and resource availability.',
    ],
    glossary: [
      { term: 'waste', definition: 'Using or losing a resource without useful benefit.' },
      { term: 'recommendations', definition: 'Suggestions for actions considered useful.' },
      { term: 'resources', definition: 'Available means used to meet needs.' },
    ],
    questions: [
      'What is the main topic of the text?',
      'What is the difference between observing a leak and advising someone to repair it?',
      'What action would you suggest at school, and which detail in the text supports it?',
    ],
    obstacle: 'Confusing a verifiable fact with advice given by the writer.',
    remediation: 'Highlight facts and advice in different colors, then ask how each fact could be verified.',
  },
  french: {
    title: 'Explaining the water cycle',
    competency: 'Organize an explanation using words that signal sequence and cause.',
    situations: [
      'Present four pictures of the water cycle in mixed order. Individually suggest an order and an explanation.',
      'In groups, write a short explanation using “first,” “then,” “because” and “finally.”',
      'Exchange drafts and check whether each connector shows sequence or cause. Justify corrections using the pictures.',
      'Distinguish time connectors from cause connectors and build a model paragraph with clear relationships.',
    ],
    evidence: 'A coherent paragraph with two sequence connectors and one cause connector used correctly.',
    texts: [
      'The Sun warms water. Some water becomes vapor. This is evaporation. The vapor rises and may cool. It then forms tiny droplets. This is condensation. These droplets help form clouds. Water falls as rain. It returns to the ground and streams.',
      'First, energy from the Sun causes water to evaporate. The vapor mixes with the air. Then, when moist air cools enough, some vapor condenses into tiny droplets and clouds may form. When droplets grow heavy enough, they fall as precipitation. Finally, water soaks into the ground or flows into streams. The cycle continues because solar energy and gravity keep water moving.',
      'The water cycle connects several reservoirs: oceans, atmosphere, soil and inland waters. Evaporation and plant transpiration transfer water to the atmosphere. When cooling conditions allow, condensation contributes to cloud formation. Precipitation then feeds runoff and infiltration. In an explanation, “then” indicates sequence, while “because” introduces a cause. A precise text does not confuse the order used to present stages with the mechanisms that drive them.',
    ],
    glossary: [
      { term: 'evaporation', definition: 'The change from liquid water to water vapor.' },
      { term: 'condensation', definition: 'The change from water vapor to liquid water.' },
      { term: 'connectors', definition: 'Words or phrases that make relationships between ideas clear.' },
    ],
    questions: [
      'What happens to some water heated by the Sun?',
      'What relationship does “then” show? What relationship does “because” show?',
      'Could you replace every sequence connector with “because”? Explain.',
    ],
    obstacle: 'Using a cause connector to describe simple sequence.',
    remediation: 'Compare two otherwise identical sentences using “then” and “because”; ask students to explain the change in meaning.',
  },
};
