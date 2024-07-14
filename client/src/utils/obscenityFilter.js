import {
  DataSet,
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
  pattern,
} from "obscenity";

const myDataSet = new DataSet()
  .addAll(englishDataset)
  .addPhrase((phrase) =>
    phrase
      .setMetadata({ originalWord: "sex" })
      .addPattern(pattern`s[?]e[?]x`)
      .addPattern(pattern`sex`)
  )
  .addPhrase((phrase) =>
    phrase
      .setMetadata({ originalWord: "balls" })
      .addPattern(pattern`b[?]a[?]l[?]l[?]s`)
      .addPattern(pattern`balls`)
      .addWhitelistedTerm("ballon")
  )
  .addPhrase((phrase) =>
    phrase
      .setMetadata({ originalWord: "clit" })
      .addPattern(pattern`c[?]l[?]i[?]t`)
      .addPattern(pattern`clit`)
  );

const obscenityFilter = new RegExpMatcher({
  ...myDataSet.build(),
  ...englishRecommendedTransformers,
});

export const isClean = (string) => !obscenityFilter.hasMatch(string);

export default obscenityFilter;
