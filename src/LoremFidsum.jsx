import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Form, Button, Container, Message, Segment,
} from 'semantic-ui-react';
import GitHubButton from 'react-github-btn';
import content from './content';
import fidlerPhrasesData from './phrases';
import logo from './logo.png';

// settings
const fidlerPhrases = fidlerPhrasesData;

/**
 * How many words are there in the string?
 * @param  {String} phrase
 *  The phrase
 * @return {Number}
 *  The word count
 */
const howManyWords = phrase => phrase.split(' ').length;

/**
 * Pick a random phrase from the list
 * @param  {Array} phrases
 *  Array of Fidler Phrases
 * @param  {Number} count
 *  The index of the chosen item
 * @return {String}
 *  The random phrase
 */
const pickRandomPhrase = (phrases, count) => phrases[Math.floor(Math.random() * count) + 1];

/**
 * Generate the lorem Fidsum text
 * @param  {Array} phrases
 *  Array of Fidler Phrases
 * @param  {Number} count
 *  How many paragraphs to generate
 * @return {Array}
 *  Array of lorem fidsum paragraphs
 */
const generateLoremFidsum = (phrases, count) => {
  let phrasesData = phrases; // the phrases to choose from
  const maxParagraphs = count; // number of paragraphs to generate
  const maxWords = 100; // max word length of the paragraphs
  let phrasesCount = phrasesData.length - 1; // length of the phrases array
  const paragraph = []; // array to push paragraphs to
  let newPhrase = ''; // concatonated string of phrases
  let phraseBank = []; // array of picked phrases

  for (let x = 0; x < maxParagraphs; x += 1) {
    // paragraph object
    paragraph[x] = {
      id: x,
      p: [],
    };

    let wordCount = 0; // keep count of the paragraph words
    for (let y = 0; y <= phrasesCount; y += 1) {
      // make sure wordcount doesn't exceed the max
      if (wordCount <= maxWords) {
        // if the phrases are depleted then reset
        if (phrasesData.length === 1) {
          phrasesData = phraseBank;
          phraseBank = [];
          phrasesCount = phrasesData.length - 1;
        }
        // the next random phrase
        const randomPhrase = pickRandomPhrase(phrasesData, phrasesCount);
        // push phrase to the bank
        phraseBank.push(randomPhrase);
        newPhrase = randomPhrase;
        // remove phrase for original list
        phrasesData = phrasesData.filter(item => item !== randomPhrase);
        // reduce array count
        phrasesCount -= 1;
        // if it's the first phrase add a prefix
        if (x === 0 && y === 0) {
          newPhrase = `Lorem Fidsum, ${newPhrase.charAt(0).toLowerCase() + newPhrase.slice(1)}`;
        }
        // push phrase to the current  paragraph
        paragraph[x].p.push(newPhrase);
        // increase the word count
        wordCount += howManyWords(newPhrase);
      } else {
        // word count exceeded
        wordCount = 0;
        // push completed paragraph to array
        paragraph[x].p = paragraph[x].p.join(' ');
        break;
      }
    }
  }
  return paragraph;
};

/**
 * Generates paragraphs as string to copy to clipboard
 * @param  {Array} text
 *  The array of paragraphs
 * @return {String}
 *  Generated string of paragraphs
 */
const generateFidlarText = (text) => {
  let formattedText = '';
  text.forEach((para) => {
    formattedText += `${para.p}\n\n`;
  });
  return formattedText;
};

const LoremFidsum = () => {
  const [text, upDateText] = useState([]); // the paragraphs
  const [count, upDateCount] = useState(1); // the amount of paragraphs to generate
  const [formattedText, updateFormattedText] = useState(''); // the formatted text for copyimg
  const [copied, updateCopied] = useState(false);
  /**
   * Trigger this once text has been generated
   * for the formatted text
   */
  React.useEffect(() => {
    updateFormattedText(() => generateFidlarText(text));
  }, [text]);

  const options = [
    { key: 1, text: '1', value: 1 },
    { key: 2, text: '2', value: 2 },
    { key: 3, text: '3', value: 3 },
    { key: 4, text: '5', value: 5 },
    { key: 5, text: '8', value: 8 },
  ]

  return (
    <>
      <Container
        text
        textAlign="center"
      >
        <Segment
          placeholder
          style={{
            marginTop: 30,
          }
        }
        >
          <img src={logo} alt="LF logo" width="40" height="40" style={{ marginRight: 'auto', marginLeft: 'auto' }} />
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <Form>
            <Form.Group style={{ justifyContent: 'center' }}>
              <Form.Dropdown 
                name="count" 
                options={options} 
                defaultValue={options[0].value} 
                compact
                selection 
                onChange={(e, {name, value}) => {
                  upDateCount(value);
                }} 
              />
              <Form.Button
                color="green"
                type="submit"
                onClick={() => {
                  upDateText(() => generateLoremFidsum(fidlerPhrases, count));
                }}
                >
                Generate
                {' '}
                {count}
                {' '}
                paragraph
                { count === 1 ? '' : 's'}
              </Form.Button>
            </Form.Group>
          </Form>
        </Segment>

      </Container>

      { text.length > 0 && (
      <Container text style={{ paddingTop: 30, paddingBottom: 40 }}>

        <div className="lorem-fidsum">
          { text.map(paragraph => <p style={{ fontFamily: 'Georgia', fontSize: 22, fontStyle: 'italic' }} key={paragraph.id}>{ paragraph.p }</p>)}
        </div>

      </Container>
      )}

      <Container
        text
        textAlign="center"
      >
        { text.length > 0 && (
          <>
            <Message>
              <CopyToClipboard
                text={formattedText}
              >
                <Button
                  basic
                  type="button"
                  color={copied ? 'olive' : 'teal'}
                  onClick={() => {
                    updateCopied(true);
                    setTimeout(() => {
                      updateCopied(false);
                    }, 3000);
                  }}
                >
                  {copied ? 'Copied! Now go paste.' : 'Copy to clipboard'}
                </Button>
              </CopyToClipboard>
            </Message>

          </>
        )}

        <div style={{ paddingTop: 20 }}>
          <GitHubButton
            href="https://github.com/invisibleloop/lorem-fidsum"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star invisibleloop/lorem-fidsum on GitHub"
          >
            Star
          </GitHubButton>
        </div>

        <p style={{ paddingTop: 30, paddingBottom: 30 }}>{content.copyright.replace('<year>', new Date().getFullYear())}</p>

      </Container>
    </>
  );
};

export default LoremFidsum;
