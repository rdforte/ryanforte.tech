#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

int main()
{
  cout << "what is the name of your blog (including dash's) for which you would like to compress png's? ";

  string blogName;

  getline(cin, blogName);

  replace(blogName.begin(), blogName.end(), ' ', '-');

  string script = "cd static/blog/images/" + blogName + " && pngquant --ext .png --force 256 *.png" + " && cd ../../../../";

  char pngCompressionScript[script.size()];
  strcpy(pngCompressionScript, script.c_str());

  system(pngCompressionScript);

  cout << "\n";

  cout << "The blog images for " << blogName << " have successfully been compressed.";
}