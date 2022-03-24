const testedColumn = {
  opinions: {
    include: {
      remarks: {
        include: {
          author: {
            include: { user: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      author: {
        include: { user: true },
      },
    },
    orderBy: {
      position: 'asc',
    },
  },
};

const nestedBoard = {
	
	...testedColumn
};
