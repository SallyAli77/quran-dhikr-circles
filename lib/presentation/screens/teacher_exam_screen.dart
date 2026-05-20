import 'dart:async';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';
import 'package:circles_online_muslim_community/src/repository/user_repository/user_repository.dart';
import 'package:circles_online_muslim_community/src/features/authentication/models/user_model.dart';
import 'package:firebase_auth/firebase_auth.dart';

class TeacherExamScreen extends StatefulWidget {
  final String applicationSubject;

  const TeacherExamScreen({super.key, required this.applicationSubject});

  @override
  State<TeacherExamScreen> createState() => _TeacherExamScreenState();
}

class _TeacherExamScreenState extends State<TeacherExamScreen> {
  int _secondsRemaining = 1200; // 20 minutes
  Timer? _timer;
  int _currentQuestionIndex = 0;
  int? _selectedOptionIndex;
  final Map<int, int> _userAnswers = {};
  bool _isSubmitted = false;

  final List<Map<String, dynamic>> _questions = [
    {
      "text": "Which Surah begins with Al-Fatiha and then Al-Baqarah?",
      "options": ["Al-Baqarah", "Al-Fatiha", "Al-Imran", "An-Nisa"],
      "correctIndex": 0,
      "juz": 1
    },
    {
      "text": "In which Juz does the directive of the change of Qibla appear?",
      "options": ["Juz 1", "Juz 2", "Juz 3", "Juz 4"],
      "correctIndex": 1,
      "juz": 2
    },
    {
      "text": "Ayah al-Kursi (the greatest verse in the Quran) is located in which Juz?",
      "options": ["Juz 2", "Juz 3", "Juz 4", "Juz 5"],
      "correctIndex": 1,
      "juz": 3
    },
    {
      "text": "In which Surah is the battle of Uhud described?",
      "options": ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah"],
      "correctIndex": 1,
      "juz": 4
    },
    {
      "text": "Which Surah focuses on women's rights and family laws in Juz 5?",
      "options": ["An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf"],
      "correctIndex": 0,
      "juz": 5
    },
    {
      "text": "The verse 'Allah does not like the public mention of evil...' starts which Juz?",
      "options": ["Juz 5", "Juz 6", "Juz 7", "Juz 8"],
      "correctIndex": 1,
      "juz": 6
    },
    {
      "text": "Which Surah contains a detailed discussion of the lawful (Halal) and unlawful (Haram) foods?",
      "options": ["Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal"],
      "correctIndex": 0,
      "juz": 7
    },
    {
      "text": "Which Surah discusses the dwellers of the Heights (الأعراف) in Juz 8?",
      "options": ["Al-An'am", "Al-A'raf", "Yunus", "Hud"],
      "correctIndex": 1,
      "juz": 8
    },
    {
      "text": "Surah Al-A'raf continues into which Juz?",
      "options": ["Juz 8", "Juz 9", "Juz 10", "Juz 11"],
      "correctIndex": 1,
      "juz": 9
    },
    {
      "text": "Which Surah describes the division of the spoils of war?",
      "options": ["Al-Anfal", "At-Tawbah", "Yunus", "Hud"],
      "correctIndex": 0,
      "juz": 10
    },
    {
      "text": "Which Surah features the story of Prophet Yunus (Jonah)?",
      "options": ["Yunus", "Hud", "Yusuf", "Ar-Ra'd"],
      "correctIndex": 0,
      "juz": 11
    },
    {
      "text": "In which Surah is the story of Prophet Yusuf (Joseph) fully detailed?",
      "options": ["Yunus", "Hud", "Yusuf", "Ibrahim"],
      "correctIndex": 2,
      "juz": 12
    },
    {
      "text": "'Verily, in the remembrance of Allah do hearts find rest' is in which Surah?",
      "options": ["Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl"],
      "correctIndex": 0,
      "juz": 13
    },
    {
      "text": "Which Surah is named after the Bee (النحل)?",
      "options": ["Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf"],
      "correctIndex": 1,
      "juz": 14
    },
    {
      "text": "The story of the miraculous night journey (Isra) starts in which Juz?",
      "options": ["Juz 14", "Juz 15", "Juz 16", "Juz 17"],
      "correctIndex": 1,
      "juz": 15
    },
    {
      "text": "The story of Dhul-Qarnayn and the sleepers of the Cave is in which Juz?",
      "options": ["Juz 15", "Juz 16", "Juz 17", "Juz 18"],
      "correctIndex": 1,
      "juz": 16
    },
    {
      "text": "Which Surah contains a collection of stories of multiple Prophets?",
      "options": ["Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur"],
      "correctIndex": 0,
      "juz": 17
    },
    {
      "text": "In which Surah is the verse of Light (Ayat al-Nur) located?",
      "options": ["An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml"],
      "correctIndex": 0,
      "juz": 18
    },
    {
      "text": "Which Surah is named 'The Criterion' (Al-Furqan)?",
      "options": ["Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas"],
      "correctIndex": 0,
      "juz": 19
    },
    {
      "text": "In which Surah is the story of Moses and the burning bush detailed in Juz 20?",
      "options": ["Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman"],
      "correctIndex": 0,
      "juz": 20
    },
    {
      "text": "Which Surah contains the wise advice of Luqman to his son?",
      "options": ["Luqman", "As-Sajdah", "Al-Ahzab", "Saba"],
      "correctIndex": 0,
      "juz": 21
    },
    {
      "text": "Which Surah describes the wives of the Prophet as the Mothers of the Believers?",
      "options": ["Al-Ahzab", "Saba", "Fatir", "Ya-Sin"],
      "correctIndex": 0,
      "juz": 22
    },
    {
      "text": "Which Surah is often referred to as the 'Heart of the Quran'?",
      "options": ["Ya-Sin", "As-Saffat", "Sad", "Az-Zumar"],
      "correctIndex": 0,
      "juz": 23
    },
    {
      "text": "'Despair not of the mercy of Allah...' is a famous verse in which Surah?",
      "options": ["Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura"],
      "correctIndex": 0,
      "juz": 24
    },
    {
      "text": "Which Surah discusses 'Ash-Shura' (Consultation)?",
      "options": ["Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah"],
      "correctIndex": 0,
      "juz": 25
    },
    {
      "text": "Which Surah discusses Islamic social ethics and manners?",
      "options": ["Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur"],
      "correctIndex": 0,
      "juz": 26
    },
    {
      "text": "Which Surah contains the description of the beauty of Paradise (Ar-Rahman)?",
      "options": ["Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah"],
      "correctIndex": 0,
      "juz": 27
    },
    {
      "text": "Which Surah is named after the Woman who pleaded with the Prophet (Al-Mujadilah)?",
      "options": ["Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff"],
      "correctIndex": 0,
      "juz": 28
    },
    {
      "text": "Surah Al-Mulk, which protects from the grave's torment, is in which Juz?",
      "options": ["Juz 28", "Juz 29", "Juz 30", "Juz 27"],
      "correctIndex": 1,
      "juz": 29
    },
    {
      "text": "Which Surah discusses the Night of Decree (Laylat al-Qadr)?",
      "options": ["Al-Qadr", "Al-Alaq", "Al-Bayyinah", "Az-Zalzalah"],
      "correctIndex": 0,
      "juz": 30
    }
  ];

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
        });
      } else {
        _timer?.cancel();
        _submitExam();
      }
    });
  }

  String _formatTime() {
    int minutes = _secondsRemaining ~/ 60;
    int seconds = _secondsRemaining % 60;
    return "${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}";
  }

  int _calculateCorrectAnswers() {
    int score = 0;
    _questions.asMap().forEach((index, q) {
      if (_userAnswers[index] == q["correctIndex"]) {
        score++;
      }
    });
    return score;
  }

  Future<void> _submitExam() async {
    _timer?.cancel();
    setState(() {
      _isSubmitted = true;
    });

    int correctAnswers = _calculateCorrectAnswers();
    double percentage = (correctAnswers / _questions.length) * 100;

    if (percentage >= 90) {
      // Success: promote to teacher!
      try {
        final email = FirebaseAuth.instance.currentUser?.email;
        if (email != null) {
          final currentUser = await UserRepository.instance.getUserDetails(email);
          if (currentUser != null) {
            final updatedUser = UserModel(
              id: currentUser.id,
              email: currentUser.email,
              password: currentUser.password,
              fullname: currentUser.fullname,
              phoneNo: currentUser.phoneNo,
              uniqueId: currentUser.uniqueId,
              role: "teacher",
              bio: currentUser.bio,
              qualifications: currentUser.qualifications,
              friends: currentUser.friends,
              friendRequests: currentUser.friendRequests,
            );
            await UserRepository.instance.updateUserDetails(updatedUser);
          }
        }
      } catch (e) {
        print("Error promoting user to teacher: $e");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isSubmitted) {
      return _buildResultView();
    }

    final question = _questions[_currentQuestionIndex];
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Quran Teacher Certification"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () {
            // Confirm quit
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text("Quit Exam?"),
                content: const Text("Your progress will be lost. Are you sure you want to exit?"),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    child: const Text("Quit", style: TextStyle(color: Colors.red)),
                  ),
                ],
              ),
            );
          },
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            alignment: Alignment.center,
            child: Row(
              children: [
                const Icon(LucideIcons.clock, color: Colors.orange, size: 20),
                const SizedBox(width: 8),
                Text(
                  _formatTime(),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.orange),
                ),
              ],
            ),
          )
        ],
      ),
      body: SafeArea(
        child: Padding(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (_currentQuestionIndex + 1) / _questions.length,
                  backgroundColor: AppTheme.border,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.tasbeehText),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Question ${_currentQuestionIndex + 1} of ${_questions.length}",
                    style: const TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.w500),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.quranTone,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "Juz ${question['juz']}",
                      style: const TextStyle(color: AppTheme.quranText, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Question text card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.card,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Text(
                  question["text"],
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, height: 1.4),
                ),
              ),
              const SizedBox(height: 24),
              // Options
              Expanded(
                child: ListView.separated(
                  itemCount: (question["options"] as List).length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, optionIndex) {
                    final optionText = question["options"][optionIndex];
                    final isSelected = _selectedOptionIndex == optionIndex || _userAnswers[_currentQuestionIndex] == optionIndex;

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedOptionIndex = optionIndex;
                          _userAnswers[_currentQuestionIndex] = optionIndex;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.tasbeehTone : AppTheme.card,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? AppTheme.tasbeehText : AppTheme.border,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                color: isSelected ? AppTheme.tasbeehText : Colors.transparent,
                                border: Border.all(color: isSelected ? AppTheme.tasbeehText : AppTheme.textMuted),
                                shape: BoxShape.circle,
                              ),
                              child: isSelected
                                  ? const Icon(LucideIcons.check, color: Colors.white, size: 16)
                                  : null,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                optionText,
                                style: TextStyle(
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                  color: isSelected ? AppTheme.tasbeehText : AppTheme.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),
              // Navigation buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (_currentQuestionIndex > 0)
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _currentQuestionIndex--;
                          _selectedOptionIndex = _userAnswers[_currentQuestionIndex];
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.card,
                        foregroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                        side: const BorderSide(color: AppTheme.border),
                        minimumSize: const Size(120, 50),
                      ),
                      child: const Text("Previous"),
                    )
                  else
                    const SizedBox(),
                  ElevatedButton(
                    onPressed: (_userAnswers[_currentQuestionIndex] == null)
                        ? null
                        : () {
                            if (_currentQuestionIndex < _questions.length - 1) {
                              setState(() {
                                _currentQuestionIndex++;
                                _selectedOptionIndex = _userAnswers[_currentQuestionIndex];
                              });
                            } else {
                              // Submit
                              _submitExam();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.tasbeehText,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      minimumSize: const Size(120, 50),
                    ),
                    child: Text(_currentQuestionIndex == _questions.length - 1 ? "Submit Exam" : "Next"),
                  ),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        ),
      ),
    );
  }

  Widget _buildResultView() {
    int correctAnswers = _calculateCorrectAnswers();
    double percentage = (correctAnswers / _questions.length) * 100;
    bool passed = percentage >= 90;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: passed ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    passed ? LucideIcons.award : LucideIcons.xCircle,
                    color: passed ? Colors.green : Colors.red,
                    size: 80,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                passed ? "Congratulations!" : "Exam Failed",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: passed ? Colors.green : Colors.red,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                passed
                    ? "You scored $correctAnswers out of ${_questions.length} ($percentage%). You are now officially certified as a Quran Teacher!"
                    : "You scored $correctAnswers out of ${_questions.length} ($percentage%). You need a minimum of 90% (27/30) to pass.",
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16, color: AppTheme.textMuted, height: 1.5),
              ),
              const SizedBox(height: 48),
              if (passed)
                ElevatedButton(
                  onPressed: () {
                    // Navigate back to home
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    minimumSize: const Size(double.infinity, 56),
                  ),
                  child: const Text("Go to Home Dashboard", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                )
              else ...[
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _isSubmitted = false;
                      _currentQuestionIndex = 0;
                      _secondsRemaining = 1200;
                      _userAnswers.clear();
                      _selectedOptionIndex = null;
                    });
                    _startTimer();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    minimumSize: const Size(double.infinity, 56),
                  ),
                  child: const Text("Retry Exam", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.primary,
                    side: const BorderSide(color: AppTheme.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    minimumSize: const Size(double.infinity, 56),
                  ),
                  child: const Text("Go Back"),
                ),
              ],
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
