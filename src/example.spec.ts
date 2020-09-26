class FriendsList {
  friends = [];

  addFriends(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const index = this.friends.indexOf(name);

    if (index === -1) throw new Error('Friend Not Found');
    this.friends.splice(index, 1);
  }
}

describe('Friends List', () => {
  let friendsList: FriendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to a list', () => {
    friendsList.addFriends('butt');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announces friendship', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriends('butt');
    expect(friendsList.announceFriendship).toHaveBeenCalled();
  });

  describe('removeFriend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriends('butt');
      expect(friendsList.friends[0]).toEqual('butt');
      friendsList.removeFriend('butt');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throws an error because error is not found', () => {
      expect(() => friendsList.removeFriend('butt')).toThrow(
        new Error('Friend Not Found'),
      );
    });
  });
});
