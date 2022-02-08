import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import CheckBox from 'expo-checkbox';
import SortableGridView from 'react-native-sortable-gridview'

export default QuizQuestion = ({
  index,
  quizData,
  questionNo,
  operator,
  setAnswers,
  answers,
  skillCode,
  percentDifficulty
}) => {

  const [checkbox1, setCheckBox1] = useState(false);
  const [checkbox2, setCheckBox2] = useState(false);
  const [checkbox3, setCheckBox3] = useState(false);
  const [checkbox4, setCheckBox4] = useState(false);
  const [checkbox5, setCheckBox5] = useState(false);

  const numOfQ = answers.length;
  const difficultyRange = percentDifficulty.split("-");
  const numOfDifficult = numOfQ * (difficultyRange[2] / 100);

  useEffect(() => {
    if (skillCode == "ORDER_NUM") {
      populateOrderingAnswers();
    }
  }, [])

  function toggleCheckBox(checkBoxName, checkBoxStatus, setCheckBox) {
    if (checkBoxName == "checkbox5") {
      if (checkBoxStatus) {
        setCheckBox(false);
      }
      else {
        setCheckBox(true);
        setCheckBox1(false);
        setCheckBox2(false);
        setCheckBox3(false);
        setCheckBox4(false);
      }
    }
    else {
      if (checkBoxStatus) {
        setCheckBox(false);
      }
      else {
        setCheckBox(true);
        setCheckBox5(false);
      }
    }

    populateCheckBoxAnswers(checkBoxName, checkBoxStatus);
  }

  function populateOrderingAnswers() {

    let inputArray = []

    inputArray.push("ℼ")
    inputArray.push(quizData[0][0]);
    inputArray.push("√" + quizData[0][1] + "\u0305");
    inputArray.push(quizData[0][2].toString().length == 1 ? "∛" + quizData[0][2] + "\u0305" : "∛" + quizData[0][2].toString().charAt(0) + "\u0305" + quizData[0][2].toString().charAt(1) + "\u0305")
    inputArray.push(quizData[0][3].toString().sup() + "⁄" +quizData[0][4].toString().sub())

    setAnswers ?
    setAnswers((prev) => {
      let prevState = prev[index];
      prevState = inputArray;
      let prevArray = prev;
      prevArray[index] = prevState;
      return [...prevArray];
    })
    : console.log();
  }

  function populateCheckBoxAnswers(checkBoxName, checkBoxStatus) {
    if (checkBoxStatus) {
      if (checkBoxName == "checkbox1") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];

            delete prevState["option1"];

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox2") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];

            delete prevState["option2"];

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox3") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];

            delete prevState["option3"];

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox4") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];

            delete prevState["option4"];

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox5") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];

            delete prevState["option5"];

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
    }
    else {
      if (checkBoxName == "checkbox1") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];
            prevState = prevState
              ? { ...prevState, option1: quizData[0][1][0] }
              : { option1: quizData[0][1][0] };

            delete prevState["option5"]
            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox2") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];
            prevState = prevState
              ? { ...prevState, option2: quizData[0][1][1] }
              : { option2: quizData[0][1][1] };

            delete prevState["option5"]
            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox3") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];
            prevState = prevState
              ? { ...prevState, option3: quizData[0][1][2] }
              : { option3: quizData[0][1][2] };

            delete prevState["option5"]

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox4") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];
            prevState = prevState
              ? { ...prevState, option4: quizData[0][1][3] }
              : { option4: quizData[0][1][3] };

            delete prevState["option5"]

            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }
      else if (checkBoxName == "checkbox5") {
        setAnswers ?
          setAnswers((prev) => {
            let prevState = prev[index];
            prevState = { option5: "None" };
            let prevArray = prev;
            prevArray[index] = prevState;
            return [...prevArray];
          })
          : console.log();
      }

    }
  }

  function formatCheckBoxOptions() {
    let answersArray = [];

    for (let i = 0; i < quizData[0][1].length; i++) {
      let optionsString = [];
      if (quizData[0][1][i].toString().includes("<")) {
        // cuberoot
        if (quizData[0][1][i].includes("&#8731")) {
          let value = quizData[0][1][i].replace("&#8731;<span style=\"text-decoration: overline\">", "")
          value = value.replace("</span>", "");
          optionsString.push(<View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 20 }}>∛</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
        }
        // squareroot
        else if (quizData[0][1][i].includes("&radic")) {
          let value = quizData[0][1][i].replace("&radic;<span style=\"text-decoration: overline\">", "")
          value = value.replace("</span>", "");
          optionsString.push(<View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 20 }}>√</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
        }
        // fraction
        else {
          let fraction = quizData[0][1][i].toString().split("&frasl;")
          let numerator = fraction[0];
          let denominator = fraction[1];

          numerator = numerator.replace("<sup>", "");
          numerator = numerator.replace("</sup>", "");

          if (denominator != undefined) {
            denominator = denominator.replace("<sub>", "");
            denominator = denominator.replace("</sub>", "");
          }

          optionsString.push(<View><Text style={[styles.numerator, { fontSize: 20 }]}>{numerator}</Text><Text style={[styles.denominator, { fontSize: 20 }]}>{denominator}</Text></View>);
        }
      }
      // π or number
      else {
        optionsString.push(<Text style={{ fontSize: 20 }}>{quizData[0][1][i]}</Text>);
      }

      answersArray[i] = optionsString;
    }

    return answersArray;
  }

  function gatherOrderingInput(data) {

    let inputArray = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i]["name"]["_owner"]) {
        inputArray.push(quizData[0][3].toString().sup() + "⁄" + quizData[0][4].toString().sub());
      }
      else {
        inputArray.push(data[i]["name"]);
      }
    }

    setAnswers((prev) => {
      let prevState = prev[index];
      prevState = inputArray;
      let prevArray = prev;
      prevArray[index] = prevState;
      return [...prevArray];
    })
  }

  function rationalNumbers() {

    let checkBoxArray = [];

    let answersArray = formatCheckBoxOptions();

    checkBoxArray.push(
      <CheckBox
        style={styles.checkBox}
        value={checkbox1}
        onValueChange={() => toggleCheckBox("checkbox1", checkbox1, setCheckBox1)}
      />
    )

    checkBoxArray.push(
      <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>{answersArray[0]}</Text>
    )

    checkBoxArray.push(
      <CheckBox
        style={styles.checkBox}
        value={checkbox2}
        onValueChange={() => toggleCheckBox("checkbox2", checkbox2, setCheckBox2)}
      />
    )

    checkBoxArray.push(
      <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>{answersArray[1]}</Text>
    )

    checkBoxArray.push(
      <CheckBox
        style={styles.checkBox}
        value={checkbox3}
        onValueChange={() => toggleCheckBox("checkbox3", checkbox3, setCheckBox3)}
      />
    )

    checkBoxArray.push(
      <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>{answersArray[2]}</Text>
    )

    checkBoxArray.push(
      <CheckBox
        style={styles.checkBox}
        value={checkbox4}
        onValueChange={() => toggleCheckBox("checkbox4", checkbox4, setCheckBox4)}
      />
    )

    checkBoxArray.push(
      <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>{answersArray[3]}</Text>
    )

    checkBoxArray.push(
      <CheckBox
        style={styles.checkBox}
        value={checkbox5}
        onValueChange={() => toggleCheckBox("checkbox5", checkbox5, setCheckBox5)}
      />
    )

    checkBoxArray.push(
      <Text style={{ textAlignVertical: 'center', fontSize: 20 }}>None</Text>
    )

    return checkBoxArray;
  }

  function fracAddSub(data) {

    let question = [];

    for (let i = 0; i < data[1].length + 1; i++) {
      if (index < numOfQ - numOfDifficult) {
        question.push(
          <View style={styles.fraction}>
            <View>
              <Text style={styles.numerator}>{data[0][i * 2]}</Text>
            </View>
            <View>
              <Text style={styles.denominator}>{data[0][i * 2 + 1]}</Text>
            </View>
          </View>
        )
        if (i < data[1].length) {
          question.push(
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.operator}>{data[1][i]}</Text>
            </View>
          )
        }
      }
      else {
        question.push(
          <View style={styles.fraction}>
            <View>
              <Text style={styles.numerator}>{data[0][i * 2]}</Text>
            </View>
            <View>
              <Text style={styles.denominator}>{data[0][i * 2 + 1]}</Text>
            </View>
          </View>
        )

        if (i == 2) {
          question.push(
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.operator}>)</Text>
            </View>
          )
        }

        if (i < data[1].length) {
          question.push(
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.operator}>{data[1][i]}</Text>
            </View>
          )
        }

        if (i == 0) {
          question.push(
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.operator}>(</Text>
            </View>
          )
        }

      }

    }

    question.push(
      <View style={styles.equal}>
        <Text style={styles.equalText}>=</Text>
      </View>
    )

    question.push(
      <View style={styles.ansAB}>
        <View style={styles.ansView}>
          <TextInput
            style={styles.ans}
            onChangeText={
              (e) => {
                setAnswers ?
                  setAnswers((prev) => {
                    let prevState = prev[index];
                    prevState = prevState
                      ? { ...prevState, ansA: e }
                      : { ansA: e };
                    let prevArray = prev;
                    prevArray[index] = prevState;
                    return [...prevArray];
                  })
                  : console.log();
              }}
            value={
              answers ?
                answers[index]
                  ? answers[index].ansA
                    ? answers[index].ansA
                    : ""
                  : ""
                : ""
            }
          ></TextInput>
        </View>
        <View style={styles.ansView}>
          <TextInput
            style={styles.ans}
            onChangeText={
              (e) => {
                setAnswers ?
                  setAnswers((prev) => {
                    let prevState = prev[index];
                    prevState = prevState
                      ? { ...prevState, ansB: e }
                      : { ansB: e };
                    let prevArray = prev;
                    prevArray[index] = prevState;
                    return [...prevArray];
                  })
                  : console.log();
              }}
            value={
              answers ?
                answers[index]
                  ? answers[index].ansB
                    ? answers[index].ansB
                    : ""
                  : ""
                : ""
            }
          ></TextInput>
        </View>
      </View>
    )

    return question;
  }

  function formatQuestion(text) {
    let rational = <Text style={{ fontSize: 20 }}>{text}</Text>
    let data = text.toString().split("?");
    let optionArray;
    // Rational Number

    // question
    if (data.length == 2) {
      optionArray = data[1];
    }

    //answer
    else {
      optionArray = data[0];
    }

    let optionsString = [];
    let options = (optionArray.toString()).replace("<br/>", "");
    if (data.length == 2) {
      options = options.substring(1, options.length - 1)
    }
    let optionsArray = options.toString().split(",");
    for (let i = 0; i < optionsArray.length; i++) {

      // squareroot || cuberoot || fraction
      if (optionsArray[i].includes("<")) {

        // cuberoot
        if (optionsArray[i].includes("&#8731")) {
          let value = optionsArray[i].replace("&#8731;<span style=\"text-decoration: overline\">", "")
          value = value.replace("</span>", "");
          optionsString.push(<View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 20 }}>∛</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
        }
        // squareroot
        else if (optionsArray[i].includes("&radic")) {
          let value = optionsArray[i].replace("&radic;<span style=\"text-decoration: overline\">", "")
          value = value.replace("</span>", "");
          optionsString.push(<View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 20 }}>√</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
        }
        // fraction
        else {
          let fraction = optionsArray[i].toString().split("&frasl;")
          let numerator = fraction[0];
          let denominator = fraction[1];

          numerator = numerator.replace("<sup>", "");
          numerator = numerator.replace("</sup>", "");

          if (denominator != undefined) {
            denominator = denominator.replace("<sub>", "");
            denominator = denominator.replace("</sub>", "");
          }

          optionsString.push(<View><Text style={[styles.numerator, { fontSize: 20 }]}>{numerator}</Text><Text style={[styles.denominator, { fontSize: 20 }]}>{denominator}</Text></View>);
        }
      }
      // π or number
      else {
        optionsString.push(<Text style={{ fontSize: 20 }}>{optionsArray[i]}</Text>);
      }

      if (i != optionsArray.length - 1) {
        optionsString.push(<Text style={{ fontSize: 20 }}>,</Text>);
      }

    }

    if (data.length == 2) {
      rational = <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontSize: 20 }}>{data[0]}?</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 20 }}>{'{'}</Text>{optionsString}<Text style={{ fontSize: 20 }}>{'}'}</Text></View></View>;
    }
    else {
      rational = <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>{optionsString}</View>;
    }

    //
    // console.log(text)
    return rational;
  }

  return (
    <View>
      <View style={styles.container}>
        {quizData ? (
          <View style={styles.question}>
            <Text style={styles.questionNo}>Q{questionNo}</Text>
          </View>
        ) : (
          <View></View>
        )}

        {skillCode == "FRAC_SIMPLIFY" || skillCode == "FRAC_ADD" || skillCode == "FRAC_MULTIPLY" ?
          <View style={styles.container}>
            <View style={styles.fraction}>
              {quizData.a ? (
                <View>
                  <Text style={styles.numerator}>{quizData.a}</Text>
                </View>
              ) : (
                <View></View>
              )}
              {quizData.b ? (
                <View>
                  <Text style={styles.denominator}>{quizData.b}</Text>
                </View>
              ) : (
                <View></View>
              )}
            </View>

            <View style={{ alignSelf: "center" }}>
              <Text style={styles.operator}>{operator}</Text>
            </View>

            {quizData.c != undefined && quizData.d != undefined ? (
              <View style={styles.fraction}>
                {quizData.c ? (
                  <View>
                    <Text style={styles.numerator}>{quizData.c}</Text>
                  </View>
                ) : (
                  <View></View>
                )}
                {quizData.d ? (
                  <View>
                    <Text style={styles.denominator}>{quizData.d}</Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            ) : (
              <View></View>
            )}
            <View style={styles.equal}>
              <Text style={styles.equalText}>=</Text>
            </View>

            <View style={styles.answers}>
              {quizData.ans ? (
                <View style={styles.ansView}>
                  <TextInput
                    style={styles.ans}
                    onChangeText={
                      (e) => {
                        setAnswers ?
                          setAnswers((prev) => {
                            let prevState = prev[index];
                            prevState = prevState
                              ? { ...prevState, ans: e }
                              : { ans: e };
                            let prevArray = prev;
                            prevArray[index] = prevState;
                            return [...prevArray];
                          })
                          : console.log();
                      }}
                    value={
                      answers ?
                        answers[index]
                          ? answers[index].ans
                            ? answers[index].ans
                            : ""
                          : ""
                        : ""
                    }
                  ></TextInput>
                </View>
              ) : (
                <View></View>
              )}
              <View style={styles.ansAB}>
                {quizData.ansA ? (
                  <View style={styles.ansView}>
                    <TextInput
                      style={styles.ans}
                      onChangeText={
                        (e) => {
                          setAnswers ?
                            setAnswers((prev) => {
                              let prevState = prev[index];
                              prevState = prevState
                                ? { ...prevState, ansA: e }
                                : { ansA: e };
                              let prevArray = prev;
                              prevArray[index] = prevState;
                              return [...prevArray];
                            })
                            : console.log();
                        }}
                      value={
                        answers ?
                          answers[index]
                            ? answers[index].ansA
                              ? answers[index].ansA
                              : ""
                            : ""
                          : ""
                      }
                    ></TextInput>
                  </View>
                ) : (
                  <View></View>
                )}
                {quizData.ansB ? (
                  <View style={styles.ansView}>
                    <TextInput
                      style={styles.ans}
                      onChangeText={
                        (e) => {
                          setAnswers ?
                            setAnswers((prev) => {
                              let prevState = prev[index];
                              prevState = prevState
                                ? { ...prevState, ansB: e }
                                : { ansB: e };
                              let prevArray = prev;
                              prevArray[index] = prevState;
                              return [...prevArray];
                            })
                            : console.log();
                        }}
                      value={
                        answers ?
                          answers[index]
                            ? answers[index].ansB
                              ? answers[index].ansB
                              : ""
                            : ""
                          : ""
                      }
                    ></TextInput>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          </View>
          :
          skillCode == "FRAC_ADD_SUB" ?

            <View style={styles.container}>
              {fracAddSub(quizData)}
            </View>

            :

            skillCode == "ORDER_NUM" ?
              <View>
                <Text style={{ fontSize: 20 }}>Arrange the following in ascending order:</Text>
                <SortableGridView
                  data={[
                    { name: "ℼ", backgroundColor: 'white', color: 'black' },
                    { name: quizData[0][0], backgroundColor: 'white', color: 'black' },
                    { name: "√" + quizData[0][1] + "\u0305", backgroundColor: 'white', color: 'black' },
                    { name: quizData[0][2].toString().length == 1 ? "∛" + quizData[0][2] + "\u0305" : "∛" + quizData[0][2].toString().charAt(0) + "\u0305" + quizData[0][2].toString().charAt(1) + "\u0305", backgroundColor: 'white', color: 'black' },
                    { name: <View><Text>{quizData[0][3]}</Text><View style={{borderTopWidth: 1, borderTopColor: 'black'}}><Text>{quizData[0][4]}</Text></View></View>, backgroundColor: 'white', color: 'black' },
                    // { name: quizData[0][3].toString().sup() + "/" + quizData[0][4].toString().sub(), backgroundColor: 'white', color: 'black' },
                  ]}
                  numPerRow={5} // let each row has four items. Default is 3
                  aspectRatio={1.2} // let height = width * 1.2. Default is 1
                  gapWidth={8} // let the gap between items become to 8. Default is 16
                  paddingTop={8} // let container's paddingTop become to 8. Default is 16
                  paddingBottom={8} // let container's paddingBottom become to 8. Default is 16
                  paddingLeft={8} // let container's paddingLeft become to 8. Default is 16
                  paddingRight={8} // let container's paddingRight become to 8. Default is 16
                  onDragStart={() => {
                    console.log('CustomLayout onDragStart');
                  }}
                  onDragRelease={(data) => {
                    console.log('CustomLayout onDragRelease', data);

                    gatherOrderingInput(data);
        
                  }}
                  renderItem={(item, index) => {
                    return (
                      <View
                        uniqueKey={item.name}
                        onTap={() => {
                        }}
                        style={[styles.item, { backgroundColor: item.backgroundColor }]}>
                        <Text style={[styles.text, { color: item.color }]}>{item.name}</Text>
                      </View>
                    )
                  }}
                />
              </View>

              :

              <View>
                {skillCode == "RATIONAL_NUM" ? formatQuestion(quizData[0][0]) : <Text style={{ fontSize: 20 }}>{quizData[0]}</Text>}
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 20, textAlignVertical: 'center' }}>Ans:  </Text>
                  {skillCode == "ROUND_OFF" && index >= numOfQ - numOfDifficult ?
                    <View style={{ flexDirection: 'row' }}>
                      <TextInput
                        style={styles.ans}
                        onChangeText={
                          (e) => {
                            setAnswers ?
                              setAnswers((prev) => {
                                let prevState = prev[index];
                                prevState = prevState
                                  ? { ...prevState, ansA: e }
                                  : { ansA: e };
                                let prevArray = prev;
                                prevArray[index] = prevState;
                                return [...prevArray];
                              })
                              : console.log();
                          }}
                        value={
                          answers ?
                            answers[index]
                              ? answers[index]
                                ? answers[index].ansA
                                : ""
                              : ""
                            : ""
                        }
                      ></TextInput>
                      <Text style={{ textAlignVertical: 'center', fontSize: 20, marginHorizontal: 25 }}>to</Text>
                      <TextInput
                        style={styles.ans}
                        onChangeText={
                          (e) => {
                            setAnswers ?
                              setAnswers((prev) => {
                                let prevState = prev[index];
                                prevState = prevState
                                  ? { ...prevState, ansB: e }
                                  : { ansB: e };
                                let prevArray = prev;
                                prevArray[index] = prevState;
                                return [...prevArray];
                              })
                              : console.log();
                          }}
                        value={
                          answers ?
                            answers[index]
                              ? answers[index]
                                ? answers[index].ansB
                                : ""
                              : ""
                            : ""
                        }
                      ></TextInput>
                    </View>
                    :
                    skillCode == "RATIONAL_NUM" ?
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {rationalNumbers()}
                      </View>
                      :
                      <TextInput
                        style={styles.ans}
                        onChangeText={
                          (e) => {
                            setAnswers ?
                              setAnswers((prev) => {
                                let prevState = prev[index];
                                prevState = prevState
                                  ? { ...prevState, ans: e }
                                  : { ans: e };
                                let prevArray = prev;
                                prevArray[index] = prevState;
                                return [...prevArray];
                              })
                              : console.log();
                          }}
                        value={
                          answers ?
                            answers[index]
                              ? answers[index]
                                ? answers[index].ans
                                : ""
                              : ""
                            : ""
                        }
                      ></TextInput>
                  }
                </View>


              </View>
        }
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: 'center',
    paddingVertical: 30,
  },
  question: {
    alignSelf: "center",
    paddingHorizontal: 50,
  },
  questionNo: {
    fontSize: 30,
  },
  numerator: {
    fontSize: 30,
    textAlign: "center",
    borderBottomColor: "#000000",
    borderBottomWidth: 2,
  },
  denominator: {
    fontSize: 30,
    textAlign: "center",
  },
  fraction: {
    flexDirection: "column",
    alignSelf: "center",
    paddingHorizontal: 50,
  },
  operator: {
    fontSize: 30,
    paddingHorizontal: 20,
  },
  equal: {
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  equalText: {
    fontSize: 30,
  },
  answers: {
    flexDirection: "row",
  },
  ans: {
    width: 65,
    height: 50,
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
  ansAB: {
    flexDirection: "column",
  },
  ansView: {
    paddingVertical: 10,
    padding: 10,
    alignSelf: "center",
  },
  checkBox: {
    marginHorizontal: 10
  },
  button: {
    width: 150,
    height: 100,
    backgroundColor: 'blue',
  },
  wrapper: {
    paddingTop: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  item: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});