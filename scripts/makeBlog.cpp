#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

int main()
{
  cout << "what is the name of your blog? ";

  string blogName;

  getline(cin, blogName);

  replace(blogName.begin(), blogName.end(), ' ', '-');

  string script = "mkdir -p static/blog/images/" + blogName + " && hugo new content/blog/" + blogName + ".md";

  char newBlogScript[script.size()];
  strcpy(newBlogScript, script.c_str());

  system(newBlogScript);

  cout << "\n";

  cout << "The blog " << blogName << "has been created in dir content/blog";
}