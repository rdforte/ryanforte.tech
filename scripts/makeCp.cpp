#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

int main()
{
  cout << "what is the name of the platform? ";

  string platform;

  getline(cin, platform);

  cout << "what is the question number? ";

  string questionNumber;

  getline(cin, questionNumber);

  cout << "what is the name of your competitive programming question? ";

  string questionName;

  getline(cin, questionName);

  replace(questionName.begin(), questionName.end(), ' ', '-');

  string formattedQuestion = platform + questionNumber + "-" + questionName;

  string script = "mkdir -p static/competitive-programming/images/" + formattedQuestion + " && hugo new content/competitive-programming/" + formattedQuestion + ".md";

  char newBlogScript[script.size()];
  strcpy(newBlogScript, script.c_str());

  system(newBlogScript);

  cout << "\n";

  cout << "The question " << formattedQuestion << " has been created in dir content/blog";
}