import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:flutter/material.dart';
import '../../lists/Tasbeeh_list.dart';
import '../../widgets/timer/count_time.dart';

class QuranCircleScreen extends StatefulWidget {
  const QuranCircleScreen({super.key});

  @override
  State<QuranCircleScreen> createState() => _QuranCircleScreenState();
}

class _QuranCircleScreenState extends State<QuranCircleScreen> {
  String? selectedTasbeeh;

  late TextEditingController _tasbeehInputController;

  @override
  void initState() {
    super.initState();
    _tasbeehInputController = TextEditingController();
  }

  @override
  void dispose() {
    _tasbeehInputController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: tSecondaryColor,
        appBar: AppBar(
          backgroundColor: tSecondaryColor,
          title: const Row(
            children: [
              CircleAvatar(
                backgroundImage: AssetImage('assets/images/teacher.png'),
              ),
              SizedBox(width: 8),
              Text(
                'Blue',
                style: TextStyle(color: tWhiteColor),
              ),
              Spacer(),
              Icon(
                Icons.exit_to_app,
                color: Colors.red,
              ),
            ],
          ),
        ),
        body: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
          return SingleChildScrollView(
              padding: const EdgeInsets.only(top: 5),
              child: ConstrainedBox(
                constraints: constraints.copyWith(
                  minHeight: constraints.maxHeight,
                  maxHeight: double.infinity,
                ),
                child: Column(
                  children: [
                    const CountdownTimerBar(
                      time: '05:00',
                      indicatorImage: AssetImage('assets/images/timer1.png'),
                    ),
                    SizedBox(
                      child: Container(
                        margin: const EdgeInsets.only(right: 5, left: 5),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.red, width: 1),
                        ),
                        child: Stack(
                          alignment: Alignment.topLeft,
                          children: [
                            const Positioned(
                              top: 0,
                              left: 0,
                              child: CircleAvatar(
                                  radius: 25,
                                  backgroundImage:
                                      AssetImage('assets/images/teacher.png')),
                            ),
                            Column(
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      flex: 2,
                                      child: Container(
                                        padding: const EdgeInsets.only(top: 5),
                                        color: Colors.transparent,
                                        height: 50,
                                        child: const Center(
                                            child: Column(
                                          children: [
                                            Text('Ahmed Start with'),
                                            Text('الحمد لله',
                                                style: TextStyle(
                                                    color: Colors.blue)),
                                          ],
                                        )),
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding:
                                      const EdgeInsets.only(right: 5, left: 5),
                                  child: Row(
                                    children: [
                                      const CircleAvatar(
                                        radius: 16,
                                        backgroundImage: AssetImage(
                                            'assets/images/baby.png'),
                                      ),
                                      const SizedBox(width: 8),
                                      const Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text('Ahmed started with',
                                                style: TextStyle(
                                                    fontSize: 14,
                                                    color: Colors.green)),
                                            Text(
                                              'الحمد لله حمدا كثيرا طيبا مباركا فيه',
                                              style: TextStyle(
                                                  fontSize: 14,
                                                  color: Colors.green),
                                              textAlign: TextAlign.start,
                                            ),
                                          ],
                                        ),
                                      ),
                                      IconButton(
                                        onPressed: () {},
                                        icon: const Icon(Icons.settings,
                                            color: Colors.blue),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  child: Row(
                                    children: [
                                      Container(
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(25),
                                          border: Border.all(
                                              color: Colors.blue, width: 1),
                                        ),
                                        child: DropdownButton<String>(
                                          value: selectedTasbeeh,
                                          items:
                                              TasbeehList.map((String Tasbeeh) {
                                            return DropdownMenuItem<String>(
                                              value: Tasbeeh,
                                              child: Text(
                                                Tasbeeh,
                                              ),
                                            );
                                          }).toList(),
                                          onChanged: (String? newValue) {
                                            setState(() {
                                              selectedTasbeeh = newValue;
                                              if (newValue != null) {
                                                _tasbeehInputController.text = newValue;
                                              }
                                            });
                                          },
                                        ),
                                      ),
                                      const SizedBox(width: 2),
                                      Container(
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(25),
                                          border: Border.all(
                                              color: Colors.blue, width: 1),
                                        ),
                                        child: DropdownButton<String>(
                                          value: selectedTasbeeh,
                                          items:
                                              TasbeehList.map((String Tasbeeh) {
                                            return DropdownMenuItem<String>(
                                              value: Tasbeeh,
                                              child: Text(
                                                Tasbeeh,
                                              ),
                                            );
                                          }).toList(),
                                          onChanged: (String? newValue) {
                                            setState(() {
                                              selectedTasbeeh = newValue;
                                              if (newValue != null) {
                                                _tasbeehInputController.text = newValue;
                                              }
                                            });
                                          },
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Expanded(
                                      child: Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                            color: const Color.fromARGB(
                                                255, 175, 205, 252),
                                            borderRadius:
                                                BorderRadius.circular(10)),
                                        child: const Row(
                                          children: [
                                            Text(
                                              '05:20',
                                              style:
                                                  TextStyle(color: Colors.red),
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              'Sara',
                                              style: TextStyle(
                                                  color: Colors.green),
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              'joined the circle',
                                              style: TextStyle(
                                                  color: Colors.black),
                                            ),
                                            SizedBox(width: 8),
                                            Text(
                                              '9/9',
                                              style: TextStyle(
                                                  color: Colors.green),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 200, // Set the desired height of the container
                      // Set the background color of the container

                      child: Row(
                        children: [
                          Expanded(
                            flex: 1,
                            child: Container(
                              padding: const EdgeInsets.only(top: 10),
                              child: const Column(
                                children: [
                                  Text('1st Maged 200',
                                      style: TextStyle(color: Colors.red)),
                                  Text('2nd Ramy 100',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('3rd Hesham 50',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('4th Ramy 49',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('5th Hesham 44',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('6th Ramy 37',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('7th Hesham 35',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('8th Ramy 33',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('9th Hesham 20',
                                      style: TextStyle(color: tWhiteColor)),
                                  Text('10th Ramy 10',
                                      style: TextStyle(color: tWhiteColor)),
                                ],
                              ),
                            ),
                          ),
                          const Expanded(
                            flex: 2,
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                Image(
                                  image: AssetImage('assets/images/table.png'),
                                  width: 5,
                                  height:
                                      5, // Replace with your image asset path
                                  // Adjust the image fit as needed
                                ),
                                Positioned(
                                  top:
                                      20, // Adjust the position of the first avatar
                                  left:
                                      110, // Adjust the position of the first avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.red,
                                    child: Text('1'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      35, // Adjust the position of the second avatar
                                  left:
                                      145, // Adjust the position of the second avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.green,
                                    child: Text('2'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      65, // Adjust the position of the third avatar
                                  left:
                                      165, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.blue,
                                    child: Text('3'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      100, // Adjust the position of the third avatar
                                  left:
                                      165, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.red,
                                    child: Text('4'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      130, // Adjust the position of the third avatar
                                  left:
                                      145, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.green,
                                    child: Text('5'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      140, // Adjust the position of the third avatar
                                  left:
                                      110, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.blue,
                                    child: Text('6'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      130, // Adjust the position of the third avatar
                                  right:
                                      145, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.red,
                                    child: Text('7'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      100, // Adjust the position of the third avatar
                                  right:
                                      165, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.green,
                                    child: Text('8'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      65, // Adjust the position of the third avatar
                                  right:
                                      165, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.blue,
                                    child: Text('9'),
                                  ),
                                ),
                                Positioned(
                                  top:
                                      35, // Adjust the position of the third avatar
                                  right:
                                      145, // Adjust the position of the third avatar
                                  child: CircleAvatar(
                                    radius: 10,
                                    backgroundColor: Colors.purple,
                                    child: Text('10'),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(right: 5, left: 5),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.blue, width: 2.0),
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Row(
                            children: [
                              CircleAvatar(
                                backgroundImage:
                                    AssetImage('assets/images/baby.png'),
                              ),
                              SizedBox(width: 8.0),
                              Icon(
                                Icons.star,
                                color: Colors.yellow,
                              ),
                              SizedBox(width: 4.0),
                              Text('Score: '),
                            ],
                          ),
                          const SizedBox(height: 16.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Stack(
                                alignment: Alignment.center,
                                children: [
                                  ElevatedButton(
                                      onPressed: () {},
                                      child: const Text("Button",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                          )))
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16.0),
                        ],
                      ),
                    ),

                    /*Container(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            backgroundImage: AssetImage('boy.png'),
                          ),
                          SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text('User'),
                                  SizedBox(width: 8),
                                  Icon(Icons.star, color: Colors.yellow),
                                ],
                              ),
                              Text('Score: 0'),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () {},
                        child: Text('Press Me'),
                        style: ButtonStyle(
                          backgroundColor:
                              MaterialStateProperty.all<Color>(Colors.blue),
                        ),
                      ),
                      SizedBox(height: 8),
                      Container(
                        height: 120,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.blue),
                        ),
                        child: TextFormField(
                          decoration: InputDecoration(
                            hintText: 'Write your own Tasbeeh here...',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      SizedBox(height: 8),
                      Container(
                        height: 10,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [
                              Colors.green,
                              Colors.lightGreen,
                              Colors.green
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.how_to_vote, color: Colors.blue),
                          SizedBox(width: 8),
                          Expanded(
                            child: Container(
                              color: Colors.blue,
                              child: DropdownButton<String>(
                                value: selectedTasbeeh,
                                items: TasbeehList.map((String Tasbeeh) {
                                  return DropdownMenuItem<String>(
                                    value: Tasbeeh,
                                    child: Text(
                                      Tasbeeh,
                                    ),
                                  );
                                }).toList(),
                                onChanged: (String? newValue) {
                                  setState(() {
                                    selectedTasbeeh = newValue!;
                                    _tasbeehInputController.text =
                                        selectedTasbeeh;
                                    print(Text(newValue));
                                  });
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              decoration: InputDecoration(
                                hintText: 'Write your own Tasbeeh here...',
                              ),
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.edit, color: Colors.blue),
                        ],
                      ),
                    ],
                  ),
                ),*/
                  ],
                ),
              ));
        }));
  }
}

/*import 'package:flutter/material.dart';

class QuranCircleScreen extends StatefulWidget {
  const QuranCircleScreen({super.key});

  @override
  State<QuranCircleScreen> createState() => _QuranCircleScreenState();
}

class _QuranCircleScreenState extends State<QuranCircleScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Row(
          children: const [
            CircleAvatar(
              backgroundImage: AssetImage('assets/images/teacher.png'),
            ),
            SizedBox(width: 8),
            Text(
              'Blue',
              style: TextStyle(color: Colors.blue),
            ),
            Spacer(),
            Icon(
              Icons.exit_to_app,
              color: Colors.red,
            ),
          ],
        ),
      ),
      body: Column(),
    );
  }
}
*/
