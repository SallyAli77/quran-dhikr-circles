import 'package:circles_online_muslim_community/src/constants/text_strings.dart';
import 'package:flutter/material.dart';
import 'package:circles_online_muslim_community/src/features/quran/arabic_sura_number.dart';
import 'package:circles_online_muslim_community/src/features/quran/myDrawer.dart';
import 'package:circles_online_muslim_community/src/features/quran/sura_builder.dart';
import 'constants.dart';

class IndexPage extends StatefulWidget {
  const IndexPage({Key? key}) : super(key: key);

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const MyDrawer(),
      floatingActionButton: FloatingActionButton(
        tooltip: "Go to Bookmark",
        backgroundColor: Colors.blue,
        onPressed: () async {
          fabIsClicked = true;
          if (await readBookmark() == true) {
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => SuraBuilder(
                          arabic: quran[0],
                          sura: bookmarkedSura - 1,
                          suraName: arabicName[bookmarkedSura - 1]["name"],
                          ayah: bookmarkedAyah,
                        )));
          }
        },
        child: const Icon(Icons.bookmark),
      ),
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          tAppName,
          style: TextStyle(
              //font family: 'quran'
              fontSize: 24,
              fontWeight: FontWeight.bold,
              shadows: [
                Shadow(
                  offset: Offset(1, 1),
                  blurRadius: 2.0,
                  color: Color.fromARGB(255, 0, 0, 0),
                ),
              ]),
        ),
        backgroundColor: Colors.blue,
      ),
      body: FutureBuilder(
        future: readJson(),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
              return const Text("Error");
            } else if (snapshot.hasData) {
              return indexCreator(snapshot.data, context);
            } else {
              return const Text("Empty Data");
            }
          } else {
            return Text("State: ${snapshot.connectionState}");
          }
        },
      ),
    );
  }

  Container indexCreator(quran, context) {
    return Container(
      color: const Color.fromARGB(255, 221, 233, 250),
      child: ListView(
        children: [
          for (dynamic i = 0; i < 114; i++)
            Container(
              color: i % 2 == 0
                  ? const Color.fromARGB(255, 230, 245, 253)
                  : const Color.fromARGB(255, 240, 247, 253),
              child: TextButton(
                onPressed: (() {
                  fabIsClicked = false;
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SuraBuilder(
                            arabic: quran[0],
                            sura: i,
                            suraName: arabicName[i]["name"],
                            ayah: 0),
                      ));
                }),
                child: Row(
                  children: [
                    ArabicSuraNumber(
                      i: i,
                    ),
                    const SizedBox(
                      width: 5,
                    ),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [],
                      ),
                    ),
                    const Expanded(child: SizedBox()),
                    Text(
                      arabicName[i]["name"],
                      style: const TextStyle(
                          fontSize: 30,
                          color: Colors.black87,
                          fontFamily: "quran",
                          shadows: [
                            Shadow(
                              offset: Offset(0.5, 0.5),
                              blurRadius: 1.0,
                              color: Color.fromARGB(255, 130, 130, 130),
                            )
                          ]),
                      textDirection: TextDirection.rtl,
                    )
                  ],
                ),
              ),
            )
        ],
      ),
    );
  }
}
