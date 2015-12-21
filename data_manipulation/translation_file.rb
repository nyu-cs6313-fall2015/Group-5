table "new_user" , :rename_to => "users" do
  column "userid", :key
  column "username", :string
end

table "new_forum" , :rename_to => "forums" do
  column "forumid", :key
  column "title", :string
end

table "new_post", :rename_to => "posts" do
  column "postid", :key
  column "threadid", :integer, :references => :threads
  column "userid", :integer, :references => :users
  column "title", :string
  column "date", :datetime
  column "content", :text
  column "forumid", :integer, :references => :forums
end


table "new_thread", :rename_to => "threads" do
  column "threadid", :key
  column "title", :string
end
