#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

int main()
{
  cout << "what is the name of your competitive programming question (including dash's) for which you would like to compress png's? ";

  string questionName;

  getline(cin, questionName);

  replace(questionName.begin(), questionName.end(), ' ', '-');

  string script = "cd static/competitive-programming/images/" + questionName + " && pngquant --ext .png --force 256 *.png" + " && cd ../../../../";

  char pngCompressionScript[script.size()];
  strcpy(pngCompressionScript, script.c_str());

  system(pngCompressionScript);

  cout << "\n";

  cout << "The competitive programming question images for " << questionName << " have successfully been compressed.";
}